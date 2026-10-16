import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
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
