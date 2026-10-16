import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {previewRedirects, acceptanceOrigin} from './build-register-preview.mjs';
const text=readFileSync(new URL('../public/_redirects',import.meta.url),'utf8');
const rules=text.split('\n').filter(l=>l.trim()&&!l.trim().startsWith('#')).map(l=>l.trim().split(/\s+/));
for(const from of ['/register','/register/']){
 const matches=rules.filter(r=>r[0]===from);assert.equal(matches.length,1);
 assert.deepEqual(matches[0],[from,'https://championlifefwb.com/outreach-register.html?campaign=huntsville-2026','302!']);
}
for(const from of ['/go','/go/'])assert.deepEqual(rules.find(r=>r[0]===from),[from,'https://championlifefwb.com/bessemer/','302!']);
assert.equal(rules.length,4);assert(!text.includes('301')&&!text.includes('*'));
const svg=readFileSync(new URL('../collateral/register/sowgo-register-qr.svg',import.meta.url),'utf8');assert(svg.includes('<svg')&&svg.includes('<path'));
console.log('PASS exact /register and /register/ temporary destinations; /go preserved; no wildcard/permanent redirects; QR collateral present');
for (const context of ['deploy-preview', 'branch-deploy']) {
 const preview = previewRedirects(text, context);
 for (const from of ['/register', '/register/']) assert(preview.includes(`${from}    ${acceptanceOrigin}/outreach-register.html?campaign=huntsville-2026    302!`));
 assert.equal(preview.split('\n').filter(l=>!l.startsWith('/register')).join('\n').trim(), text.split('\n').filter(l=>!l.startsWith('/register')).join('\n').trim());
 assert.equal(readFileSync(new URL('../public/_redirects',import.meta.url),'utf8'),text);
}
for(const context of ['production','dev','',undefined]) assert.throws(()=>previewRedirects(text,context));
assert.throws(()=>previewRedirects(text.replaceAll('https://championlifefwb.com/outreach-register.html','https://example.org/outreach-register.html'),'deploy-preview'));
assert.throws(()=>previewRedirects(text.replace(/^\/register\/\s.*$/m,''),'deploy-preview'));
console.log('PASS isolated preview destinations, production-context rejection, unchanged source and /go, malformed/missing destination rejection');
