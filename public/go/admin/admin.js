// Existing email-code Auth protocol; no signup, callback/template change or persistent token storage.
const $=id=>document.getElementById(id);let config,token='',email='',state,busy=false;
function message(text){$('status').textContent=text;}
function clearWorkspace(){state=null;$('workspace').hidden=true;$('management').hidden=true;$('current').replaceChildren();$('campaign').replaceChildren();$('analytics').replaceChildren();}
async function request(path,body,authorized=false){
 const r=await fetch(config.url+path,{method:'POST',headers:{apikey:config.key,'Content-Type':'application/json',...(authorized?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
 if(!r.ok){if(authorized){clearWorkspace();if(r.status===401||r.status===403){token='';$('login').hidden=false;$('verify').hidden=true;}}throw Error(r.status===403?'Outreach router access unavailable. Contact an administrator.':r.status===401?'Your session expired. Sign in again.':'Unable to complete this request. Refresh and try again.');}
 return r.json();
}
async function work(action,payload={}){return request('/rest/v1/rpc/outreach_router_admin',{p_slug:'sowgo-outreach',p_action:action,p_payload:payload},true);}
async function load(){
 clearWorkspace();state=await work('view');const active=state.campaigns.find(c=>c.id===state.router.active_campaign_id);
 const name=document.createElement('strong');name.textContent=active?.eligible?active.name:'Fallback · Find Your Outreach';$('current').append(name,document.createTextNode(active?.eligible?active.public_url:'Visitors see the branded SowGo fallback page.'));
 for(const c of state.campaigns.filter(c=>c.eligible)){const o=document.createElement('option');o.value=c.id;o.textContent=c.name+' — '+c.public_url;o.selected=c.id===state.router.active_campaign_id;$('campaign').append(o);}
 for(const item of state.analytics){const li=document.createElement('li');const c=state.campaigns.find(c=>c.id===item.destination_campaign);li.textContent=`${item.timestamp} · ${c?.name||'Fallback'} · ${item.outcome} · ${item.count} scans`;$('analytics').append(li);}
 if(!state.analytics.length){const li=document.createElement('li');li.textContent='No recorded scans yet.';$('analytics').append(li);}
 $('workspace').hidden=false;$('management').hidden=!state.can_manage;message('Router loaded. Changes take effect without a deployment.');
}
async function run(fn){if(busy)return;busy=true;document.querySelectorAll('button').forEach(b=>b.disabled=true);try{await fn();}catch(e){message(e.message||'Router unavailable.');}finally{busy=false;document.querySelectorAll('button').forEach(b=>b.disabled=false);$('activate').disabled=!state?.can_manage||!$('campaign').options.length;}}
$('login').addEventListener('submit',e=>{e.preventDefault();run(async()=>{email=$('email').value.trim();await request('/auth/v1/otp',{email,create_user:false});$('login').hidden=true;$('verify').hidden=false;message('Check your email and enter its code here.');});});
$('verify').addEventListener('submit',e=>{e.preventDefault();run(async()=>{const code=$('code').value;const data=await request('/auth/v1/verify',{email,token:code,type:'email'});$('code').value='';if(!data.access_token)throw Error('Sign-in could not be verified.');token=data.access_token;$('verify').hidden=true;await load();});});
$('activate').addEventListener('click',()=>run(async()=>{await work('activate',{revision:state.router.revision,campaign_id:$('campaign').value});await load();}));
$('deactivate').addEventListener('click',()=>run(async()=>{await work('deactivate',{revision:state.router.revision});await load();}));
$('save').addEventListener('submit',e=>{e.preventDefault();run(async()=>{await work('save_campaign',{revision:state.router.revision,code:$('campaign-code').value,name:$('campaign-name').value,public_url:$('campaign-url').value,eligible:$('eligible').checked});await load();});});
$('reload').addEventListener('click',()=>run(load));
$('end').addEventListener('click',()=>{token='';clearWorkspace();$('login').hidden=false;$('verify').hidden=true;$('code').value='';message('Admin session ended on this page.');});
run(async()=>{const r=await fetch('/api/outreach-router-config',{cache:'no-store'});if(!r.ok)throw Error('This router is awaiting environment configuration.');config=await r.json();if(!/^https:\/\/[a-z]{20}\.supabase\.co$/.test(config.url)||!config.key?.startsWith('sb_publishable_'))throw Error('Router configuration unavailable.');$('login').hidden=false;message('Sign in with your existing authorized staff account.');});
