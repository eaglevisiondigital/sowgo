import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const html=readFileSync('public/go/admin/index.html','utf8'),js=readFileSync('public/go/admin/admin.js','utf8');
const config={url:'https://abcdefghijklmnopqrst.supabase.co',key:'sb_publishable_test'};
const initial={router:{revision:1,active_campaign_id:null},can_manage:true,campaigns:[{id:'bessemer',code:'bessemer',name:'Bessemer <img src=x onerror=alert(1)>',public_url:'https://championlifefwb.com/bessemer/',eligible:true}],analytics:[]};
async function setup({canManage=true}={}){
 const dom=new JSDOM(html,{url:'https://sowgo.org/go/admin/',runScripts:'outside-only'}),w=dom.window,calls=[];let current=structuredClone(initial),deny=0;current.can_manage=canManage;
 w.fetch=async(url,options={})=>{
  const body=options.body?JSON.parse(options.body):null;calls.push({url,body,headers:options.headers});
  if(url==='/api/outreach-router-config')return Response.json(config);
  if(url.endsWith('/auth/v1/otp'))return Response.json({});
  if(url.endsWith('/auth/v1/verify'))return Response.json({access_token:'synthetic-page-token'});
  assert.equal(options.headers.Authorization,'Bearer synthetic-page-token');
  if(deny)return new Response('{}',{status:deny});
  if(body.p_action==='view')return Response.json(current);
  assert.equal(body.p_payload.revision,current.router.revision);current.router.revision++;
  if(body.p_action==='activate')current.router.active_campaign_id=body.p_payload.campaign_id;
  if(body.p_action==='deactivate')current.router.active_campaign_id=null;
  return Response.json({saved:true,revision:current.router.revision});
 };
 const wait=async()=>{for(let i=0;i<8;i++)await new Promise(r=>setTimeout(r,0));};
 const el=id=>w.document.getElementById(id),submit=id=>el(id).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
 w.eval(js);await wait();
 const login=async()=>{el('email').value='synthetic@example.test';submit('login');await wait();el('code').value='123456';submit('verify');await wait();};
 return {dom,w,calls,el,submit,wait,login,setDeny:n=>{deny=n;}};
}
test('staff panel preserves existing-account Auth; scoped actions, no token persistence or HTML execution',async()=>{
 const s=await setup();try{
  assert.equal(s.el('workspace').hidden,true);assert.equal(s.el('login').hidden,false);await s.login();
  assert.deepEqual(s.calls.find(c=>c.url.endsWith('/auth/v1/otp')).body,{email:'synthetic@example.test',create_user:false});
  assert.equal(s.el('code').value,'');assert.equal(s.el('workspace').hidden,false);assert.equal(s.el('management').hidden,false);
  assert.equal(s.el('campaign').querySelector('img'),null);assert.match(s.el('campaign').textContent,/<img/);
  assert.equal(s.w.localStorage.length,0);assert.equal(s.w.sessionStorage.length,0);assert.equal(s.w.document.cookie,'');
  s.el('activate').click();await s.wait();assert.match(s.el('current').textContent,/Bessemer/);assert.match(s.el('current').textContent,/https:\/\/championlifefwb.com\/bessemer\//);assert.equal(s.el('current').querySelector('img'),null);
  s.el('deactivate').click();await s.wait();assert.match(s.el('current').textContent,/Find Your Outreach/);
  s.el('end').click();assert.equal(s.el('workspace').hidden,true);assert.equal(s.el('current').textContent,'');assert.equal(s.el('login').hidden,false);
 }finally{s.dom.window.close();}
});
test('view-only, wrong-account/revoked and expired sessions never retain protected content',async()=>{
 for(const status of [401,403]){
  const s=await setup({canManage:false});try{await s.login();assert.equal(s.el('management').hidden,true);assert.equal(s.el('activate').disabled,true);s.setDeny(status);s.el('reload').click();await s.wait();assert.equal(s.el('workspace').hidden,true);assert.equal(s.el('current').textContent,'');assert.equal(s.el('analytics').textContent,'');assert.equal(s.el('campaign').textContent,'');assert.equal(s.el('login').hidden,false);assert.match(s.el('status').textContent,status===401?/session expired/:/Contact an administrator/);}finally{s.dom.window.close();}
 }
});
