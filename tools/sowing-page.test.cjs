// Run with jsdom available on NODE_PATH. No requests, submissions or payments.
const assert=require('node:assert/strict');
const {readFileSync,existsSync}=require('node:fs');
const {resolve}=require('node:path');
const {execFileSync}=require('node:child_process');
const {JSDOM}=require('jsdom');
const root=resolve(__dirname,'..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const provider='https://www.community.givehub.com/forms/outreach-main-giving';
const base='d068b3b90d79e9b355937a9702c18dcad24508d3';
let checks=0;
function check(value,message){assert(value,message);checks++;}
function setup(path,url){const dom=new JSDOM(read(path),{url,runScripts:'outside-only'});dom.window.matchMedia=()=>({matches:false,addEventListener(){}});dom.window.eval(read('public/site-data.js'));return dom;}
const home=setup('public/index.html','https://sowgo.org/');
home.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
home.window.eval(read('public/site.js'));
check(home.window.document.querySelectorAll('.event-card').length===15,'all current outreach cards retained');
check(home.window.document.querySelectorAll('a[href="/sow/"]').length===4,'nav, hero, participation and footer use internal route');
for(const event of home.window.SOWGO_CONFIG.events){
 const link=home.window.document.querySelector('[data-event-id="'+event.id+'"] .event-actions a[href^="/sow/"]');
 check(link&&link.getAttribute('href')==='/sow/?outreach='+encodeURIComponent(event.id),'card sow link: '+event.id);
}
home.window.document.querySelector('[data-open-schedule]').click();
check(home.window.document.querySelectorAll('.schedule-row a[href^="/sow/"]').length===15,'full schedule uses same internal destination');
check(!home.window.document.querySelector('#sow-dialog'),'old external giving modal removed');
check(!read('public/site.js').includes('data-sow-event'),'no modal interception prevents normal sow navigation');
for(const element of home.window.document.querySelectorAll('a'))check(!element.href.includes('outreach-giving'),'no Champion Life giving link remains');
const oldConfig={};require('node:vm').runInNewContext(execFileSync('git',['show',base+':public/site-data.js'],{cwd:root,encoding:'utf8'}),{window:oldConfig});
const current=JSON.parse(JSON.stringify(home.window.SOWGO_CONFIG));const original=JSON.parse(JSON.stringify(oldConfig.SOWGO_CONFIG));delete current.sowUrl;delete original.sowUrl;assert.deepEqual(current,original);checks++;
check(read('public/_redirects')===execFileSync('git',['show',base+':public/_redirects'],{cwd:root,encoding:'utf8'}),'QR and attendee registration redirects unchanged');
for(const query of ['', '?outreach=minden-2026','?outreach=unknown','?outreach=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E','?outreach=https%3A%2F%2Fevil.example']){
 const page=setup('public/sow/index.html','https://sowgo.org/sow/'+query);const w=page.window;w.eval(read('public/sow/sow.js'));
 check(w.document.querySelector('iframe').src===provider,'provider source fixed for '+query);
 check(w.document.querySelectorAll('iframe').length===1&&w.document.querySelectorAll('form,input').length===0,'card data stays in hosted form');
 check(w.document.getElementById('outreach-context').hidden===(query!=='?outreach=minden-2026'),'known reference only');
 check(!w.document.querySelector('[onerror]'),'query never becomes markup');
 const menu=w.document.querySelector('.menu-toggle');menu.click();check(menu.getAttribute('aria-expanded')==='true','menu opens');w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));check(menu.getAttribute('aria-expanded')==='false','Escape closes menu');
 page.window.close();
}
for(const path of ['public/index.html','public/sow/index.html']){
 const doc=new JSDOM(read(path)).window.document;
 check(doc.body.textContent.includes('Corporate HQ')&&doc.body.textContent.includes('650 Denton Blvd NW'),'HQ retained and labeled');
 check(doc.body.textContent.includes('Office Location')&&doc.body.textContent.includes('27 Warwick')&&doc.body.textContent.includes('Shalimar, FL'),'office added');
}
const page=new JSDOM(read('public/sow/index.html')).window.document;
for(const el of page.querySelectorAll('[src],link[href]')){
 const value=el.getAttribute('src')||el.getAttribute('href');if(value.startsWith('/'))check(existsSync(resolve(root,'public',value.slice(1))),'asset exists: '+value);
}
check(page.querySelector('img[src*="accepted-cards"]').alt==='American Express, Mastercard, Visa, and Discover','payment marks described accessibly');
const headers=read('public/_headers');
check(headers.includes('frame-src https://www.community.givehub.com;'),'only supplied frame origin permitted');
for(const token of ["script-src 'self'","connect-src 'none'","frame-ancestors 'none'","X-Frame-Options: DENY"])check(headers.includes(token),'retained protection: '+token);
home.window.close();console.log('PASS '+checks+' sowing navigation, event context, assets, locations, menu and boundary checks. No network calls or payments.');
