import {cp, readFile, writeFile, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const holdingRoutes = Object.freeze({
  '/go': '/next-steps/',
  '/go/': '/next-steps/',
  '/register': '/minden/attendee-info/',
  '/register/': '/minden/attendee-info/',
  '/registration': '/minden/attendee-info/',
  '/registration/': '/minden/attendee-info/'
});
export function previewRedirects(source, context) {
  if (!['deploy-preview', 'branch-deploy'].includes(context)) throw Error('Preview context required');
  const rules = source.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#')).map(line => line.split(/\s+/));
  for (const [from, destination] of Object.entries(holdingRoutes)) {
    const matches = rules.filter(rule => rule[0] === from);
    if (matches.length !== 1 || matches[0].length !== 3 || matches[0][1] !== destination || matches[0][2] !== '302!') throw Error(`Unexpected or missing holding route: ${from}`);
  }
  return source;
}

export async function buildPreview(root, context) {
  const source = await readFile(resolve(root, 'public/_redirects'), 'utf8');
  const redirects = previewRedirects(source, context);
  const output = resolve(root, 'preview-public');
  await rm(output, {recursive:true, force:true});
  await cp(resolve(root, 'public'), output, {recursive:true});
  await writeFile(resolve(output, '_redirects'), redirects);
  await writeFile(resolve(output, 'assets/js/supabase-config.js'), '// Preview intake is always disabled; no production settings are read.\nwindow.CHAMPION_LIFE_SUPABASE = null;\n');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildPreview(fileURLToPath(new URL('../', import.meta.url)), process.env.CONTEXT);
  console.log('Built local holding-page preview with partner intake disabled; committed public files preserved.');
}
