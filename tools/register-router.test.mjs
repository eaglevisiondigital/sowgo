import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cp, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import {runInNewContext} from 'node:vm';
import {previewRedirects, buildPreview} from './build-register-preview.mjs';

const publicRoot = new URL('../public/', import.meta.url);
const text = readFileSync(new URL('_redirects', publicRoot), 'utf8');
const rules = text.split('\n').filter(line => line.trim() && !line.trim().startsWith('#')).map(line => line.trim().split(/\s+/));
const attendeeRoutes = ['/register', '/register/', '/registration', '/registration/'];
const resourceRoutes = ['/go', '/go/'];
for (const from of attendeeRoutes) {
  const matches = rules.filter(rule => rule[0] === from);
  assert.equal(matches.length, 1);
  assert.deepEqual(matches[0], [from, '/minden/attendee-info/', '302!']);
}
for (const from of resourceRoutes) {
  const matches = rules.filter(rule => rule[0] === from);
  assert.equal(matches.length, 1);
  assert.deepEqual(matches[0], [from, '/next-steps/', '302!']);
}
assert.equal(rules.length, 6);
assert(!text.includes('301') && !text.includes('*'));
const svg = readFileSync(new URL('../collateral/register/sowgo-register-qr.svg', import.meta.url), 'utf8');
assert(svg.includes('<svg') && svg.includes('<path'));

const attendee = readFileSync(new URL('minden/attendee-info/index.html', publicRoot), 'utf8');
const resources = readFileSync(new URL('next-steps/index.html', publicRoot), 'utf8');
const context = {window: {}};
runInNewContext(readFileSync(new URL('site-data.js', publicRoot), 'utf8'), context);
const config = context.window.SOWGO_CONFIG;
const minden = config.events.find(event => event.id === 'minden-2026');
assert(attendee.includes(`datetime="${minden.start}"`));
assert(attendee.includes('Registration details to be confirmed'));
assert(attendee.includes('Attendee registration is not open on this page.'));
assert(attendee.includes(`href="${minden.signup}"`));
assert.equal(minden.signup, 'https://championlifefwb.com/minden-serve');
assert(attendee.includes('do not register you as an attendee'));
assert(resources.includes(`href="${config.discipleshipUrl}"`));
assert(resources.includes(`href="${config.prayerUrl}"`));
for (const page of [attendee, resources]) {
  assert(!/<(?:form|input|textarea|select|iframe|script)\b/i.test(page));
  assert(!/huntsville|outreach-register|registration-thank-you/i.test(page));
  assert(page.includes('href="/styles.css"') && page.includes('/assets/images/sowgo-logo.png'));
}

for (const buildContext of ['deploy-preview', 'branch-deploy']) assert.equal(previewRedirects(text, buildContext), text);
for (const buildContext of ['production', 'dev', '', undefined]) assert.throws(() => previewRedirects(text, buildContext));
assert.throws(() => previewRedirects(text.replaceAll('/minden/attendee-info/', 'https://example.org/register'), 'deploy-preview'));
assert.throws(() => previewRedirects(text.replaceAll('/next-steps/', 'https://championlifefwb.com/huntsville/'), 'deploy-preview'));
assert.throws(() => previewRedirects(text.replace(/^\/registration\/\s.*$/m, ''), 'deploy-preview'));
assert.throws(() => previewRedirects(text + '\n/register /minden/attendee-info/ 302!\n', 'deploy-preview'));

const fixture = await mkdtemp(resolve(tmpdir(), 'sowgo-router-preview-'));
try {
  await cp(publicRoot, resolve(fixture, 'public'), {recursive: true});
  const unsafeSourceFixture = 'window.CHAMPION_LIFE_SUPABASE = {previewSafetyFixture: true};\n';
  await writeFile(resolve(fixture, 'public/assets/js/supabase-config.js'), unsafeSourceFixture);
  await buildPreview(fixture, 'deploy-preview');
  assert.equal(await readFile(resolve(fixture, 'preview-public/_redirects'), 'utf8'), text);
  assert.match(await readFile(resolve(fixture, 'preview-public/assets/js/supabase-config.js'), 'utf8'), /window\.CHAMPION_LIFE_SUPABASE = null;/);
  assert.equal(await readFile(resolve(fixture, 'public/assets/js/supabase-config.js'), 'utf8'), unsafeSourceFixture);
  for (const path of ['minden/attendee-info/index.html', 'next-steps/index.html', 'register/index.html', 'registration-thank-you/index.html']) {
    assert.equal(await readFile(resolve(fixture, 'preview-public', path), 'utf8'), readFileSync(new URL(path, publicRoot), 'utf8'));
  }
} finally {
  await rm(fixture, {recursive: true, force: true});
}
assert.equal(readFileSync(new URL('_redirects', publicRoot), 'utf8'), text);
console.log('PASS six temporary holding routes; separate attendee/resources journeys; no collection; exact approved resource links; preview partner intake disabled; historical forms and source preserved; invalid/production contexts rejected');
