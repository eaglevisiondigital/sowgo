import {fallbackHTML} from '../lib/router-page.js';
export function safeDestination(value) {
 return typeof value==='string' && value.length<=2048 && /^https:\/\/(championlifefwb\.com|sowgo\.org)\/[A-Za-z0-9_/-]*$/.test(value) && !value.slice(8).includes('//') && !/\/go(\/|$)/.test(value);
}
export function backendConfig(env) {
 const url=env.get('SOWGO_ROUTER_SUPABASE_URL'),key=env.get('SOWGO_ROUTER_PUBLISHABLE_KEY');
 return /^https:\/\/[a-z]{20}\.supabase\.co$/.test(url||'') && /^sb_publishable_[A-Za-z0-9_-]+$/.test(key||'') ? {url,key} : null;
}
const headers={'Cache-Control':'no-store, max-age=0','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY'};
export function makeHandler(env,fetcher=fetch) {
 return async (request,context) => {
  const path=new URL(request.url).pathname,cfg=backendConfig(env);
  if(path==='/api/outreach-router-config') return new Response(JSON.stringify(cfg||{unavailable:true}),{status:cfg?200:503,headers:{...headers,'Content-Type':'application/json','X-Robots-Tag':'noindex, nofollow'}});
  if(path==='/go/admin'||path.startsWith('/go/admin/')) {
   const response=await context.next();const h=new Headers(response.headers);
   for(const [k,v] of Object.entries(headers))h.set(k,v);
   h.set('X-Robots-Tag','noindex, nofollow');
   h.set('Content-Security-Policy',`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self' ${cfg?.url||''}; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`);
   return new Response(response.body,{status:response.status,headers:h});
  }
  if(!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405,headers:{...headers,Allow:'GET, HEAD'}});
  let destination;
  if(cfg) {
   try {
    const r=await fetcher(cfg.url+'/rest/v1/rpc/resolve_outreach_router',{method:'POST',headers:{apikey:cfg.key,'Content-Type':'application/json'},body:JSON.stringify({p_slug:'sowgo-outreach',p_track:request.method==='GET'}),signal:AbortSignal.timeout(2500)});
    if(r.ok) {const data=await r.json();if(data.outcome==='redirect'&&safeDestination(data.public_url))destination=data.public_url;}
   } catch { /* Configuration/network errors yield the same safe page; no raw logs. */ }
  }
  if(destination) return new Response(null,{status:302,headers:{...headers,Location:destination}});
  return new Response(request.method==='HEAD'?null:fallbackHTML,{status:200,headers:{...headers,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'self'; script-src 'none'; style-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"}});
 };
}
export default (request,context)=>makeHandler(Netlify.env)(request,context);
