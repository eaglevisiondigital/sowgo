import {test} from 'node:test';import {readFileSync,readdirSync} from 'node:fs';import assert from 'node:assert/strict';import {makeHandler,safeDestination} from '../../netlify/edge-functions/outreach-router.js';
const env={get:k=>({'SOWGO_ROUTER_SUPABASE_URL':'https://abcdefghijklmnopqrst.supabase.co','SOWGO_ROUTER_PUBLISHABLE_KEY':'sb_publishable_test'}[k])};
const req=(suffix='',method='GET')=>new Request('https://sowgo.org/go'+suffix,{method});
test('edge redirect ignores attack query; HTTPS response has no cache/PII',async()=>{
 let payload;const h=makeHandler(env,async(url,o)=>{payload=JSON.parse(o.body);return Response.json({outcome:'redirect',public_url:'https://championlifefwb.com/bessemer/'});});
 const r=await h(req('?next=https://evil.test&campaign=other'));assert.equal(r.status,302);assert.equal(r.headers.get('location'),'https://championlifefwb.com/bessemer/');assert.deepEqual(payload,{p_slug:'sowgo-outreach',p_track:true});assert.match(r.headers.get('cache-control'),/no-store/);assert.equal(r.headers.get('set-cookie'),null);
 await h(req('','HEAD'));assert.equal(payload.p_track,false);assert.equal((await h(req('','POST'))).status,405);
});
test('invalid, looping, unavailable or malformed backend always yields branded fallback',async()=>{
 for(const value of ['https://evil.test/','//evil.test','https://championlifefwb.com.evil.test/a','https://sowgo.org/go/','https://sowgo.org/go/admin','https://championlifefwb.com/%2f/','https://championlifefwb.com/a?next=evil']){
  assert.equal(safeDestination(value),false);const r=await makeHandler(env,async()=>Response.json({outcome:'redirect',public_url:value}))(req());assert.equal(r.status,200);assert.match(await r.text(),/Find Your Outreach/);
 }
 for(const fetcher of [async()=>{throw Error('timeout')},async()=>new Response('bad'),async()=>new Response('denied',{status:403})])assert.equal((await makeHandler(env,fetcher)(req())).status,200);
 assert.deepEqual(readdirSync('netlify/edge-functions').sort(),['outreach-router.js'],'only executable edge entry points are bundled');
 const noCfg=makeHandler({get:()=>undefined},()=>assert.fail('must not contact DB'));assert.equal(await (await noCfg(req())).text(),readFileSync('public/go/index.html','utf8'));assert.equal((await noCfg(req('','HEAD'))).body,null);
});
test('admin page gets scoped CSP and no-store; config publishes only public settings',async()=>{
 const h=makeHandler(env);const r=await h(req('/admin'),{next:async()=>new Response('admin',{headers:{'Content-Security-Policy':"connect-src 'none'"}})});assert.match(r.headers.get('content-security-policy'),/connect-src 'self' https:\/\/abcdefghijklmnopqrst.supabase.co/);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');
 const c=await h(new Request('https://sowgo.org/api/outreach-router-config'));assert.deepEqual(await c.json(),{url:env.get('SOWGO_ROUTER_SUPABASE_URL'),key:'sb_publishable_test'});
});
