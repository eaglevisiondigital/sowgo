// Uses NODE_PATH for the existing locked jsdom install. All submissions are fictional.
const assert=require('node:assert/strict');
const {readFileSync,mkdtempSync,rmSync,readdirSync}=require('node:fs');
const {resolve,join}=require('node:path');
const {tmpdir}=require('node:os');
const {JSDOM}=require('jsdom');
const {webcrypto}=require('node:crypto');
const {runInNewContext}=require('node:vm');
const root=resolve(__dirname,'..'),read=p=>readFileSync(resolve(root,p),'utf8');
let checks=0;const check=(v,m)=>{assert(v,m);checks++};
const required=['first-name','last-name','email','address-line-1','address-line-2','city','state-province','postal-code','phone','commitment-amount','commitment-frequency'];
(async()=>{
 for(const outcome of ['accepted','unaccepted','http-failure','network-failure'])for(const query of ['', '?brand=champion-life','?brand=evil']){
  const dom=new JSDOM(read('public/partner/index.html'),{url:'https://sowgo.org/partner/'+query,runScripts:'outside-only'}),w=dom.window;
  const calls=[],timers=[],navigations=[];let challenge;
  w.CHAMPION_LIFE_SUPABASE={url:'https://fictional.example',publishableKey:'public-test-value',outreachSiteKey:'fictional-site-key'};
  w.turnstile={render(_el,options){challenge=options;options.callback('fictional-verification');return 1},reset(){}};
  const context={window:w,document:w.document,location:{pathname:'/partner/',search:query,assign:url=>navigations.push(url)},crypto:webcrypto,TextEncoder,URLSearchParams,sessionStorage:w.sessionStorage,setTimeout:(fn,delay)=>timers.push({fn,delay}),fetch:async(url,args)=>{calls.push({url,args});if(outcome==='network-failure')throw Error('Fictional network failure');return {ok:outcome!=='http-failure',status:outcome==='http-failure'?400:200,json:async()=>({accepted:outcome!=='unaccepted'})}}};
  runInNewContext(read('public/assets/js/outreach-partner.js'),context);w.eval(read('public/partner/partner.js'));
  const form=w.document.querySelector('form'),status=form.querySelector('[role=status]');
  check(w.document.querySelector('.outreach-brand-sowgo'),'SowGo fixed despite query');check(w.document.querySelector('.outreach-brand-logo').alt==='SowGo','approved brand');check(form.querySelector('[type=submit]').textContent==='Submit & Continue to Sow','sowing action');
  assert.deepEqual([...form.elements].filter(e=>required.includes(e.name)).map(e=>e.name),required);checks++;
  check(!w.document.querySelector('[role=dialog],[aria-modal]'),'standalone semantics');
  const values=['Fictional','QA Partner','qa@example.test','1 Fictional Street','','Test City','FL','00000','2025550123','1.00','Monthly'];required.forEach((name,i)=>form.elements.namedItem(name).value=values[i]);form.reportValidity=()=>true;
  await new Promise(r=>setImmediate(r));check(challenge.action==='outreach_partner','existing challenge action');form.dispatchEvent(new w.Event('submit',{cancelable:true}));form.dispatchEvent(new w.Event('submit',{cancelable:true}));await new Promise(r=>setTimeout(r,25));
  check(calls.length===1,'double submission suppressed');check(calls[0].url==='https://fictional.example/functions/v1/outreach-partner-submit','one shared service');const payload=JSON.parse(calls[0].args.body).payload;check(payload.brand==='sowgo'&&payload.source_path==='/partner/','brand/source attribution only');
  if(outcome==='accepted'){
   check(status.querySelector('a').href==='https://sowgo.org/sow/','backup destination');check(timers.length===1&&timers[0].delay===500,'accepted continuation only');timers[0].fn();assert.deepEqual(navigations,['https://sowgo.org/sow/']);checks++;
  }else{check(status.querySelector('a')===null&&timers.length===0&&navigations.length===0,'failure remains on form');check(!form.querySelector('[type=submit]').disabled&&status.classList.contains('is-error'),'failure feedback/retry preserved');}
  check(!w.sessionStorage.getItem('outreach-partner-replay:sowgo').includes('qa@example.test'),'replay stores no contact payload');dom.window.close();
 }
 const {buildPartnerSite}=await import('../tools/build-partner-site.mjs'),{buildPreview}=await import('../tools/build-register-preview.mjs');
 const temp=mkdtempSync(join(tmpdir(),'sowgo-partner-test-'));
 try{
  const {cp}=require('node:fs/promises');await cp(resolve(root,'public'),join(temp,'public'),{recursive:true});
  for(const env of [{CONTEXT:'deploy-preview',OUTREACH_PUBLIC_SITE_KEY:'0x4AAAAAASyntheticSiteKeyValue'},{CONTEXT:'production'},{CONTEXT:'production',OUTREACH_PUBLIC_SITE_KEY:'1x00000000000000000000AA'}])await assert.rejects(()=>buildPartnerSite(temp,env));checks+=3;
  const {output}=await buildPartnerSite(temp,{CONTEXT:'production',OUTREACH_PUBLIC_SITE_KEY:'0x4AAAAAASyntheticSiteKeyValue'}),sandbox={window:{}};runInNewContext(readFileSync(join(output,'assets/js/supabase-config.js'),'utf8'),sandbox);check(sandbox.window.CHAMPION_LIFE_SUPABASE.outreachSiteKey==='0x4AAAAAASyntheticSiteKeyValue','public site key supplied only by production environment');check(sandbox.window.CHAMPION_LIFE_SUPABASE.url==='https://exdocjbmylgxssanymjk.supabase.co','existing shared production service');
  function files(dir,prefix=''){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name),prefix+e.name+'/'):[prefix+e.name]);}
  for(const name of files(join(temp,'public')))if(name!=='assets/js/supabase-config.js'){assert.deepEqual(readFileSync(join(output,name)),readFileSync(join(temp,'public',name)));checks++;}
  await buildPreview(temp,'deploy-preview');const preview={window:{}};runInNewContext(readFileSync(join(temp,'preview-public/assets/js/supabase-config.js'),'utf8'),preview);check(preview.window.CHAMPION_LIFE_SUPABASE===null,'preview cannot write to production');
 }finally{rmSync(temp,{recursive:true,force:true});}
 console.log('PASS '+checks+' SowGo standalone branding, fields, outcomes, duplicate, compiler and preview-boundary checks');
})().catch(e=>{console.error(e);process.exitCode=1});
