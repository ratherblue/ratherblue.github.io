# ratherblue.com

Personal portfolio: React + TypeScript + Vite, with SCSS modules.

```
npm install
npm run dev     # http://localhost:5173
npm run build   # outputs dist/
```

- Content (projects, screenshots, social links) lives in `src/data/content.ts`. Most of it is still placeholder text.
- Design tokens and the light/dark themes are in `src/styles/global.scss`. Breakpoints and mixins are in `src/styles/`.
- Styling conventions: one `Component.module.scss` per component, camelCase classes and no BEM. Variants go in `data-*` attributes. Write mobile-first with `@include from(md)`, and never hard-code a colour or media query.
- Deploys to GitHub Pages on every push to `master` (`.github/workflows/deploy.yml`). The custom domain is set in the repo's Settings → Pages (Actions deploys ignore a CNAME file). Pages has no rewrites, so the workflow copies `index.html` to `404.html` so that routes like `/legacy` load on refresh.
- Images and video are built from originals in `images-src/` (gitignored) with `npm run images`. Commit the output in `public/images/`; CI doesn't rebuild it.
