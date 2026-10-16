-- Independent routing catalog, not a second Outreach/People engine.
-- Requires only the released Organizations + People/Staff permission baseline.
do $$begin
 if to_regprocedure('private.has_staff_permission(uuid,text,uuid)') is null
 or not exists(select 1 from public.organizations where slug='sowgo') then
  raise exception 'Released staff permission baseline and SowGo organization required';
 end if;
end $$;
create table private.outreach_route_campaigns (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
 code text not null check(code ~ '^[a-z0-9][a-z0-9_-]{0,79}$'),
 name text not null check(length(btrim(name)) between 1 and 160), public_url text not null,
 eligible boolean not null default false, revision integer not null default 1,
 unique(organization_id,id), unique(organization_id,code)
);
create function private.outreach_route_url_valid(p_url text) returns boolean
language sql immutable set search_path='' as $$
 select coalesce(length(p_url)<=2048 and p_url ~ '^https://(championlifefwb[.]com|sowgo[.]org)/[A-Za-z0-9_/-]*$'
 and substring(p_url from 9) not like '%//%' and p_url !~ '/go(/|$)',false)
$$;
alter table private.outreach_route_campaigns add constraint outreach_route_safe_url check(private.outreach_route_url_valid(public_url));
create table private.outreach_routers (
 id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id),
 slug text not null unique check(slug ~ '^[a-z0-9][a-z0-9_-]{0,79}$'),
 qr_identifier text not null unique, active_campaign_id uuid,
 revision integer not null default 1, updated_at timestamptz not null default now(),
 foreign key(organization_id,active_campaign_id) references private.outreach_route_campaigns(organization_id,id)
);
create table private.outreach_route_counts (
 router_id uuid not null references private.outreach_routers(id), bucket timestamptz not null,
 destination_key text not null, outcome text not null check(outcome in ('redirect','fallback')),
 scans bigint not null check(scans>0), first_seen_at timestamptz not null, last_seen_at timestamptz not null,
 primary key(router_id,bucket,destination_key,outcome)
);
create table private.outreach_route_audit (
 id uuid primary key default gen_random_uuid(), router_id uuid not null references private.outreach_routers(id),
 actor_id uuid not null references auth.users(id), action text not null, campaign_id uuid,
 created_at timestamptz not null default now(), revision integer not null
);
alter table private.outreach_route_campaigns enable row level security;
alter table private.outreach_routers enable row level security;
alter table private.outreach_route_counts enable row level security;
alter table private.outreach_route_audit enable row level security;
revoke all on private.outreach_route_campaigns,private.outreach_routers,private.outreach_route_counts,private.outreach_route_audit from public,anon,authenticated,service_role;

create function private.outreach_route_resolve(p_slug text,p_track boolean) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r private.outreach_routers; c private.outreach_route_campaigns; result jsonb; resolved_outcome text:='fallback'; seen timestamptz:=clock_timestamp();
begin
 select * into r from private.outreach_routers where slug=p_slug;
 if not found then return jsonb_build_object('outcome','fallback');end if;
 select * into c from private.outreach_route_campaigns where id=r.active_campaign_id and organization_id=r.organization_id and eligible;
 if found and private.outreach_route_url_valid(c.public_url) then
  resolved_outcome:='redirect';result:=jsonb_build_object('outcome',resolved_outcome,'campaign_id',c.id,'campaign_name',c.name,'public_url',c.public_url,'qr_identifier',r.qr_identifier);
 else
  c.id:=null;result:=jsonb_build_object('outcome','fallback','qr_identifier',r.qr_identifier);
 end if;
 -- Atomic, anonymous hourly counters: no IP, UA, referrer, query, cookie or contact data.
 -- Telemetry failure never prevents routing. HEAD requests use p_track=false.
 if p_track then
  begin
   insert into private.outreach_route_counts(router_id,bucket,destination_key,outcome,scans,first_seen_at,last_seen_at)
   values(r.id,date_trunc('hour',seen),coalesce(c.id::text,''),resolved_outcome,1,seen,seen)
   on conflict(router_id,bucket,destination_key,outcome) do update
   set scans=private.outreach_route_counts.scans+1,last_seen_at=excluded.last_seen_at;
  exception when others then null;
  end;
 end if;
 return result;
end $$;
create function public.resolve_outreach_router(p_slug text default 'sowgo-outreach',p_track boolean default true) returns jsonb
language sql security definer set search_path='' as $$select private.outreach_route_resolve(p_slug,p_track)$$;

create function private.outreach_route_admin(p_slug text,p_action text,p_payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r private.outreach_routers; c private.outreach_route_campaigns; selected uuid; rev integer;
begin
 select * into r from private.outreach_routers where slug=p_slug for update;
 if not found or not private.has_staff_permission(r.organization_id,'outreach.view') then
  raise exception 'Outreach router access unavailable' using errcode='42501';end if;
 if p_action='view' then
  return jsonb_build_object('router',jsonb_build_object('slug',r.slug,'qr_identifier',r.qr_identifier,'active_campaign_id',r.active_campaign_id,'revision',r.revision),
   'can_manage',private.has_staff_permission(r.organization_id,'outreach.manage'),
   'campaigns',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'code',code,'name',name,'public_url',public_url,'eligible',eligible) order by name),'[]') from private.outreach_route_campaigns where organization_id=r.organization_id),
   'analytics',(select coalesce(jsonb_agg(jsonb_build_object('timestamp',bucket,'destination_campaign',nullif(destination_key,''),'qr_identifier',r.qr_identifier,'outcome',outcome,'count',scans,'first_seen_at',first_seen_at,'last_seen_at',last_seen_at) order by bucket desc),'[]') from private.outreach_route_counts where router_id=r.id and bucket>=now()-interval '30 days'));
 end if;
 if not private.has_staff_permission(r.organization_id,'outreach.manage') then raise exception 'Outreach router management unavailable' using errcode='42501';end if;
 if p_payload is null or jsonb_typeof(p_payload)<>'object' or (p_payload->>'revision')::integer is distinct from r.revision then raise exception 'Router changed; reload before saving' using errcode='40001';end if;
 if p_action='save_campaign' then
  if exists(select 1 from jsonb_object_keys(p_payload) k where k not in ('revision','code','name','public_url','eligible')) then raise exception 'Unsupported campaign field';end if;
  if not private.outreach_route_url_valid(p_payload->>'public_url') or jsonb_typeof(p_payload->'eligible')<>'boolean' then raise exception 'Approved HTTPS destination and eligibility required';end if;
  insert into private.outreach_route_campaigns(organization_id,code,name,public_url,eligible)
   values(r.organization_id,p_payload->>'code',btrim(p_payload->>'name'),p_payload->>'public_url',(p_payload->>'eligible')::boolean)
   on conflict(organization_id,code) do update set name=excluded.name,public_url=excluded.public_url,eligible=excluded.eligible,revision=private.outreach_route_campaigns.revision+1 returning * into c;
  selected:=c.id;
 elsif p_action='activate' then
  if exists(select 1 from jsonb_object_keys(p_payload) k where k not in ('revision','campaign_id')) then raise exception 'Unsupported activation field';end if;
  select * into c from private.outreach_route_campaigns where id=(p_payload->>'campaign_id')::uuid and organization_id=r.organization_id and eligible;
  if not found or not private.outreach_route_url_valid(c.public_url) then raise exception 'Eligible approved campaign required';end if;
  selected:=c.id;update private.outreach_routers set active_campaign_id=selected where id=r.id;
 elsif p_action='deactivate' then
  if exists(select 1 from jsonb_object_keys(p_payload) k where k<>'revision') then raise exception 'Unsupported deactivation field';end if;
  update private.outreach_routers set active_campaign_id=null where id=r.id;
 else raise exception 'Unsupported router action';end if;
 update private.outreach_routers set revision=revision+1,updated_at=now() where id=r.id returning revision into rev;
 insert into private.outreach_route_audit(router_id,actor_id,action,campaign_id,revision) values(r.id,auth.uid(),p_action,selected,rev);
 return jsonb_build_object('saved',true,'revision',rev);
end $$;
create function public.outreach_router_admin(p_slug text,p_action text,p_payload jsonb default '{}') returns jsonb
language sql security invoker set search_path='' as $$select private.outreach_route_admin(p_slug,p_action,p_payload)$$;
revoke all on function private.outreach_route_url_valid(text),private.outreach_route_resolve(text,boolean),private.outreach_route_admin(text,text,jsonb),public.resolve_outreach_router(text,boolean),public.outreach_router_admin(text,text,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.resolve_outreach_router(text,boolean) to anon,authenticated;
grant execute on function private.outreach_route_admin(text,text,jsonb),public.outreach_router_admin(text,text,jsonb) to authenticated;
-- Public resolver is a deliberately narrow definer facade: only approved public route + aggregate counter.
-- No anon USAGE or helper grants on private; authenticated admin facade retains existing guarded pattern.
-- Never expose private through PostgREST.
-- No staff grants, Auth configuration, campaign-core dependencies or live activation.
insert into private.outreach_route_campaigns(organization_id,code,name,public_url,eligible)
 select id,'bessemer_al_2026','Bessemer, Alabama 2026','https://championlifefwb.com/bessemer/',true from public.organizations where slug='sowgo';
insert into private.outreach_routers(organization_id,slug,qr_identifier)
 select id,'sowgo-outreach','universal_outreach_qr' from public.organizations where slug='sowgo';
