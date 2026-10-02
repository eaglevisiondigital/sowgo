# SowGo standalone website

Standalone frontend for **sowgo.org**, based on Dave Fowler's approved responsive mission website design. This repository is separate from `eaglevisiondigital/championlife`.

## Initial setup status

The repository has been initialized for the approved website upload. **The actual website files still need to be uploaded into `public/` before deployment.** The setup files alone are not a working website.

Upload the `public` folder from the prepared **SowGo-GitHub-Upload.zip** package into this repository's root, preserving its folder name and contents. The final tree must include `public/index.html`, `public/styles.css`, `public/site.js`, `public/site-data.js`, and `public/assets/`.

## Netlify

Use the existing project; do not create a duplicate:

- Project: `sowgo`
- Team display name: `ChatGPT`
- Team slug: `dfowler4232`
- Project ID: `6895fac9-d4bb-413f-a585-889442f212dd`
- Dashboard: https://app.netlify.com/projects/sowgo
- Repository: `eaglevisiondigital/sowgo`
- Production branch for this standalone review frontend: `main`
- Base directory: repository root (leave blank)
- Build command: none (leave blank)
- Publish directory: `public`

`netlify.toml` publishes only `public/`. No dependency installation, backend credentials, or environment variables are required by this static review package.

After all website files are committed, link this repository to the existing Netlify project and verify its deployment. Do not claim the website is live before the deployment and hosted page have been checked. Custom-domain/DNS cutover is a later step.

## Preserve the approved design

Preserve the navy/orange brand, the original God's Love Compels Us hero, Sow terminology, equal-height event cards, the 50,000+ salvations / 16 years ministry-reported figure, Gospel of the Kingdom messaging, and the What Happens After Salvation discipleship section. Do not replace this design with intervening alternative mockups.

## Integration boundaries

- Champion Life's website, repository, acceptance work, and shared backend remain unchanged.
- Reuse the existing Champion Life/SowGo backend for future approved signup, outreach, and financial integrations. Do not create a duplicate operational database.
- Current public form, partnership, discipleship, and outreach sowing destinations are preserved. No new payment processor or merchant routing is enabled by this website deployment.
- Funding bars in this review build are labeled design placeholders, not real financial totals.
- Generated photos are temporary illustrations, not documentary ministry photos. Replace only through focused approved asset changes.
- App download availability and new backend integrations are not claimed as released. Do not add invented app store links or credentials.
- Keep review disclosures and noindex settings until the corresponding release checks pass.

The complete approved source archive, reference mockup, and previous local test reports remain in the accompanying project delivery files. No successful hosted deployment is recorded by this initialization.
