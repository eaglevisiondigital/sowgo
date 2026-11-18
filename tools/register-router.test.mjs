import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {previewRedirects, expectedDestinations} from './build-register-preview.mjs';

const source=readFileSync(new URL('../public/_redirects',import.meta.url),'utf8');
const routes=source.split('\n').map(line=>line.trim()).filter(line=>line&&!line.startsWith('#')).map(line=>line.split(/\s+/));
const expected=Object.entries(expectedDestinations);
assert.equal(expected.length,10,'10 exact public entrypoints expected');
assert.equal(routes.length,expected.length,'No missing, unexpected or duplicate redirect rules');
for (const [from,destination] of expected) {
 const matches=routes.filter(rule=>rule[0]===from);
 assert.equal(matches.length,1,'Exactly one redirect for '+from);
 assert.deepEqual(matches[0],[from,destination,'302!'],'Exact Minden destination for '+from);
}
assert(!source.includes('301')&&!source.includes('*'),'No permanent or wildcard redirects');
const svg=readFileSync(new URL('../collateral/register/sowgo-register-qr.svg',import.meta.url),'utf8');
assert(svg.includes('<svg')&&svg.includes('<path'),'Existing printed register QR stays in source');

const review='https://synthetic-minden-review--championlifechurch.netlify.app';
for (const context of ['deploy-preview','branch-deploy']) {
 const result=previewRedirects(source,context,review);
 const transformed=result.split('\n').map(line=>line.trim()).filter(line=>line.startsWith('/')).map(line=>line.split(/\s+/));
 assert.equal(transformed.length,10);
 for(const [from,destination] of expected)
  assert.deepEqual(transformed.find(rule=>rule[0]===from),
   [from,review+new URL(destination).pathname,'302!']);
 assert.equal(readFileSync(new URL('../public/_redirects',import.meta.url),'utf8'),source,
   'Source redirect artifact unchanged by preview generation');
}
for(const badContext of ['production','dev','',undefined])
 assert.throws(()=>previewRedirects(source,badContext,review),/Preview context required/);
for(const badOrigin of [undefined,'','http://synthetic-minden-review--championlifechurch.netlify.app',
 'https://example.org','https://synthetic-minden-review--championlifechurch.netlify.app.evil.org',
 'https://synthetic-minden-review--championlifechurch.netlify.app/other',
 'https://user:pass@synthetic-minden-review--championlifechurch.netlify.app'])
 assert.throws(()=>previewRedirects(source,'deploy-preview',badOrigin));
assert.throws(()=>previewRedirects(source.replace('https://championlifefwb.com/minden/',
 'https://championlifefwb.com/huntsville/'),'deploy-preview',review),/drift/);
assert.throws(()=>previewRedirects(source.replace(/^\/registration\/\s+.*$/m,''),
 'deploy-preview',review),/Missing/);
assert.throws(()=>previewRedirects(source+ '\n/go   https://championlifefwb.com/minden/   302!\n',
 'deploy-preview',review),/duplicate/);
console.log('PASS: 10 source Minden redirects and 10 mapped preview aliases; original printed QR file preserved');
console.log('PASS: preview requires verified exact origin; production, drift, duplicates and legacy Huntsville targets reject');
