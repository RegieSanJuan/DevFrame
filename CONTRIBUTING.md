# Contributing to DevFrame

Thanks for helping DevFrame stay useful. The project is free and open-source,
and contributions are welcome across code, docs, templates, and bug reports.

## Ways to help

- Star the repository: https://github.com/RegieSanJuan/DevFrame
- Report bugs with a clear title, expected behavior, actual behavior, and steps
  to reproduce.
- Suggest features for Builder, Studio, public portfolios, templates, or
  deployment workflows.
- Improve documentation, setup notes, screenshots, and examples.
- Contribute templates that follow the shared template registry and schema.

## Local setup

```bash
npm install
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` for local work. Clerk and Supabase can stay
unset when you only need preview/demo mode.

## Pull request guidelines

- Keep changes focused and small.
- Follow the existing dark-first DevFrame design system.
- Do not introduce paid tiers or payment API logic.
- Do not add per-template database tables.
- Do not special-case templates in `portfolio-renderer.tsx`.
- Run lint and build before opening a pull request.

## Support

Optional donations are shown on `/support` through GoTyme InstaPay and GCash QR
images only. There is no Ko-fi, PayPal, Patreon, or payment API integration.
