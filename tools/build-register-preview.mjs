import {cp, readFile, writeFile, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const acceptanceOrigin = 'https://codex-huntsville-registration-2026--championlifechurch.netlify.app';
export function previewRedirects(source, context) {
  if (!['deploy-preview', 'branch-deploy'].includes(context)) throw Error('Preview context required');
  let count = 0;
  const result = source.replace(/^(\/register\/?)\s+(\S+)\s+302!\s*$/gm, (_, from, destination) => {
    const target = new URL(destination);
    if (target.origin !== 'https://championlifefwb.com' || target.pathname !== '/outreach-register.html' || target.searchParams.getAll('campaign').length !== 1 || target.hash || target.username || target.password) throw Error('Unexpected registration destination');
    count++;
    return `${from}    ${acceptanceOrigin}${target.pathname}${target.search}    302!`;
  });
  if (count !== 2) throw Error('Both explicit registration routes are required');
  return result;
}

export async function buildPreview(root, context) {
  const source = await readFile(resolve(root, 'public/_redirects'), 'utf8');
  const redirects = previewRedirects(source, context);
  const output = resolve(root, 'preview-public');
  await rm(output, {recursive:true, force:true});
  await cp(resolve(root, 'public'), output, {recursive:true});
  await writeFile(resolve(output, '_redirects'), redirects);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildPreview(fileURLToPath(new URL('../', import.meta.url)), process.env.CONTEXT);
  console.log('Built isolated registration preview; committed public files preserved.');
}
