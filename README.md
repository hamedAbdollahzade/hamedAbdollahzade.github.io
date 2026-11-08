# Webino-Dev

Website of Webino-Dev, a small web and software development team based in Mashhad, Iran. It presents the team's services, projects, developers and tutorials, and lets visitors send a project request through a chat that continues on WhatsApp.

Live: <https://webino-dev.ir>

Built with Next.js (static export) and TypeScript, deployed to GitHub Pages with GitHub Actions.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```

A `Dockerfile` and `docker-compose.yml` are included to serve the built site with nginx:

```bash
docker compose up -d --build
```

## Content

The site is bilingual: Persian at `/` and English at `/en/`, with a dark and a light theme. Persian content lives in `data/`, English copy in `data/en/`, interface strings in `lib/ui.ts`, and the tutorials in `content/blog/*.md` (Persian only).

## License

Personal project. All rights reserved.
