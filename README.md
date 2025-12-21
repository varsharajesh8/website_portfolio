# Varsha Rajesh — Portfolio (Next.js)

Dark-mode-first portfolio with:
- Projects index + per-project pages
- Embedded PDFs (posters/reports)
- In-browser code browsing (static files)
- Blog (MDX)
- Data Playground (CSV upload → interactive Plotly chart)

## Quick start

```bash
npm install
npm run dev
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import into Vercel.
3. Add your custom domain (e.g., `varsha.me`) in Vercel → Settings → Domains.

## Update links

- `components/Nav.tsx`: replace GitHub/LinkedIn URLs
- `public/assets/resume.pdf`: replace if you update your resume
- `content/blog/*.mdx`: add blog posts
- `content/projects.json`: edit titles/descriptions/tags if desired

## Project assets

Your uploaded zip was copied into:

- `public/assets/projects/<slug>/...` (source + PDFs)
- `public/assets/headshot.jpeg`
- `public/assets/resume.pdf`

If you later want to link to GitHub repos, add a `repoUrl` to each project in `content/projects.json` and render it on the project page.