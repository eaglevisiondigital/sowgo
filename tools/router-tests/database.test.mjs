import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {randomUUID} from 'node:crypto';
import {migrationOrder} from './baseline-order.mjs';
const root=resolve(process.env.CHAMPION_LIFE_BASELINE||'../outreach-partner-production-isolation');
test('released permission baseline + isolated router, RLS/tenant/revocation/analytics',async()=>{
 const db=new PGlite(),q=(s,p=[])=>db.query(s,p);
 try {
  await db.exec(readFileSync(root+'/tools/backend-tests/fixtures/supabase-test-bootstrap.sql','utf8'));
  await db.exec(readFileSync(root+'/supabase/bootstrap/automatic-rls.sql','utf8'));
  for(const f of migrationOrder)await db.exec(readFileSync(root+'/supabase/migrations/'+f,'utf8'));
  const before=await q("select count(*)::int n from public.organization_staff_permissions");
  for(const f of readdirSync('supabase/migrations').sort())await db.exec(readFileSync('supabase/migrations/'+f,'utf8'));
  assert.deepEqual((await q('select count(*)::int n from public.organization_staff_permissions')).rows,before.rows);
  assert.equal((await q("select to_regclass('public.outreach_campaigns') absent")).rows[0].absent,null,'no PR5 campaign dependency');
  const org=(await q("select id from organizations where slug='sowgo'")).rows[0].id,other=(await q("select id from organizations where slug='champion-life'")).rows[0].id;
  const users=Array.from({length:5},()=>randomUUID());
  for(let i=0;i<5;i++){
   await q('insert into auth.users(id,email,email_confirmed_at) values($1,$2,$3)',[users[i],`router-${i}@example.test`,i===3?null:new Date()]);
   await q("insert into organization_staff_directory(organization_id,user_id,display_name) values($1,$2,'Synthetic')",[i===4?other:org,users[i]]);
  }
  for(const i of [0,1,3,4])await q("insert into organization_staff_permissions(organization_id,user_id,permission) values($1,$2,'outreach.view')",[i===4?other:org,users[i]]);
  for(const i of [0,3,4])await q("insert into organization_staff_permissions(organization_id,user_id,permission) values($1,$2,'outreach.manage')",[i===4?other:org,users[i]]);
  const as=async i=>{await db.exec('reset role');await q("select set_config('request.jwt.claim.sub',$1,false)",[i===null?'':users[i]]);await db.exec('set role '+(i===null?'anon':'authenticated'));};
  const view=()=>q("select public.outreach_router_admin('sowgo-outreach','view','{}') v").then(r=>r.rows[0].v);
  const admin=(action,p)=>q('select public.outreach_router_admin($1,$2,$3) v',['sowgo-outreach',action,p]).then(r=>r.rows[0].v);
  const router=(track=true)=>q("select public.resolve_outreach_router('sowgo-outreach',$1) v",[track]).then(r=>r.rows[0].v);
  await as(null);assert.equal((await router()).outcome,'fallback');await assert.rejects(view);
  for(const t of ['outreach_route_campaigns','outreach_routers','outreach_route_counts','outreach_route_audit'])await assert.rejects(()=>q('select * from private.'+t));
  for(const i of [2,3,4]){await as(i);await assert.rejects(view);}
  await as(1);let v=await view();assert.equal(v.can_manage,false);await assert.rejects(()=>admin('activate',{revision:v.router.revision,campaign_id:v.campaigns[0].id}));
  await as(0);v=await view();const b=v.campaigns[0];assert.equal(b.public_url,'https://championlifefwb.com/bessemer/');
  await admin('activate',{revision:v.router.revision,campaign_id:b.id});assert.equal((await router()).public_url,b.public_url);
  await assert.rejects(()=>admin('deactivate',{revision:v.router.revision}),'stale concurrent edit refused');
  for(const url of ['http://championlifefwb.com/bessemer/','https://evil.test/','https://championlifefwb.com.evil.test/','https://user@championlifefwb.com/','https://championlifefwb.com:443/bessemer/','https://sowgo.org/go','https://sowgo.org/go/','https://sowgo.org/go/admin','https://championlifefwb.com//evil','https://championlifefwb.com/%2f%2fevil','https://championlifefwb.com/a?next=https://evil.test','https://championlifefwb.com/a#x','https://championlifefwb.com/../go/']){
   v=await view();await assert.rejects(()=>admin('save_campaign',{revision:v.router.revision,code:'bad',name:'Bad',public_url:url,eligible:true}));
  }
  v=await view();await admin('save_campaign',{revision:v.router.revision,code:'huntsville_al_2026',name:'Synthetic Future Huntsville',public_url:'https://championlifefwb.com/huntsville/',eligible:false});
  v=await view();const h=v.campaigns.find(c=>c.code==='huntsville_al_2026');await assert.rejects(()=>admin('activate',{revision:v.router.revision,campaign_id:h.id}));
  await admin('save_campaign',{revision:v.router.revision,code:h.code,name:h.name,public_url:h.public_url,eligible:true});v=await view();await admin('activate',{revision:v.router.revision,campaign_id:h.id});assert.equal((await router()).public_url,h.public_url,'runtime switch without code or schema change');
  // A real foreign-tenant catalog ID cannot be activated by a SowGo administrator.
  await db.exec('reset role');const foreign=(await q("insert into private.outreach_route_campaigns(organization_id,code,name,public_url,eligible) values($1,'foreign','Foreign','https://championlifefwb.com/foreign/',true) returning id",[other])).rows[0].id;
  await as(0);v=await view();await assert.rejects(()=>admin('activate',{revision:v.router.revision,campaign_id:foreign}));
  // Corrupt stored data simulates bypassed/legacy validation: resolver fails safely anyway.
  await db.exec('reset role;alter table private.outreach_route_campaigns drop constraint outreach_route_safe_url');
  await q("update private.outreach_route_campaigns set public_url='https://evil.test/' where id=$1",[h.id]);await as(null);assert.equal((await router()).outcome,'fallback');
  await db.exec('reset role');await q('update private.outreach_route_campaigns set public_url=$1 where id=$2',[h.public_url,h.id]);await db.exec('alter table private.outreach_route_campaigns add constraint outreach_route_safe_url check(private.outreach_route_url_valid(public_url))');
  await as(0);v=await view();await admin('deactivate',{revision:v.router.revision});assert.equal((await router(false)).outcome,'fallback');
  v=await view();const scans=v.analytics.reduce((sum,x)=>sum+x.count,0);for(let n=0;n<10;n++)assert.equal((await router()).outcome,'fallback');v=await view();assert.equal(v.analytics.reduce((sum,x)=>sum+x.count,0),scans+10);
  assert.deepEqual(Object.keys(v.analytics[0]).sort(),['count','destination_campaign','first_seen_at','last_seen_at','outcome','qr_identifier','timestamp']);
  await db.exec('reset role');await q('update organization_staff_directory set active=false where organization_id=$1 and user_id=$2',[org,users[0]]);await as(0);await assert.rejects(view,'immediate same-session revocation');await assert.rejects(()=>admin('deactivate',{revision:v.router.revision}));
  await db.exec('reset role');assert.equal((await q("select count(*)::int n from pg_tables where schemaname='private' and tablename in ('outreach_route_campaigns','outreach_routers','outreach_route_counts','outreach_route_audit') and rowsecurity")).rows[0].n,4);
  assert.equal((await q('select count(*)::int n from private.outreach_route_audit')).rows[0].n,5);
 } finally {await db.close();}
});
