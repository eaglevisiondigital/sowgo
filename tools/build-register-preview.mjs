import {cp, readFile, writeFile, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

// No preview target is assumed. The Minden candidate requires an explicitly
// verified Champion Life preview origin before any unpublished cross-site build.
export const expectedDestinations = Object.freeze({
  '/registration':'https://championlifefwb.com/minden/register/',
  '/registration/':'https://championlifefwb.com/minden/register/',
  '/register':'https://championlifefwb.com/minden/register/',
  '/register/':'https://championlifefwb.com/minden/register/',
  '/go':'https://championlifefwb.com/minden/',
  '/go/':'https://championlifefwb.com/minden/',
  '/minden/register':'https://championlifefwb.com/minden/register/',
  '/minden/register/':'https://championlifefwb.com/minden/register/',
  '/minden/go':'https://championlifefwb.com/minden/',
  '/minden/go/':'https://championlifefwb.com/minden/'
});

export function previewRedirects(source, context, acceptanceOrigin) {
  if (!['deploy-preview', 'branch-deploy'].includes(context))
    throw Error('Preview context required');
  if (!acceptanceOrigin || typeof acceptanceOrigin !== 'string')
    throw Error('Exact Minden Champion Life preview origin must be verified and supplied');
  let review;
  try { review=new URL(acceptanceOrigin); }
  catch { throw Error('Invalid preview origin'); }
  if (review.protocol!=='https:' ||
      !/^[a-z0-9-]+--championlifechurch\.netlify\.app$/.test(review.hostname) ||
      review.pathname!=='/' || review.search || review.hash ||
      review.username || review.password || review.port)
    throw Error('Untrusted preview origin');

  const seen=new Set();
  const output=source.replace(/^(\/[^\s]+)\s+(\S+)\s+(\S+)\s*$/gm,(line,from,destination,code)=>{
    if (!Object.hasOwn(expectedDestinations,from))return line;
    if (code!=='302!' || destination!==expectedDestinations[from] || seen.has(from))
      throw Error('Minden route drift or duplicate: '+from);
    seen.add(from);
    return `${from}    ${review.origin}${new URL(destination).pathname}    302!`;
  });
  if (seen.size!==Object.keys(expectedDestinations).length)
    throw Error('Missing required Minden routes');
  return output;
}

export async function buildPreview(root, context) {
  const source=await readFile(resolve(root,'public/_redirects'),'utf8');
  const preview=previewRedirects(source,context,process.env.MINDEN_CHAMPIONLIFE_PREVIEW_ORIGIN);
  const output=resolve(root,'preview-public');
  await rm(output,{recursive:true,force:true});
  await cp(resolve(root,'public'),output,{recursive:true});
  await writeFile(resolve(output,'_redirects'),preview);
}
if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  await buildPreview(fileURLToPath(new URL('../',import.meta.url)),process.env.CONTEXT);
  console.log('Built isolated Minden registration + decision preview; production source preserved.');
}
