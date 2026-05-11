# Contributing

Thanks for helping improve MCSR Ranked Companion.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Checks

Run these before opening a pull request:

```bash
npm audit --omit=dev
npm run type-check
npm run build
```

If your change touches the Tauri shell, also run:

```bash
npm run tauri:build
```

## Guidelines

- Keep changes focused and easy to review.
- Do not commit `.env.local`, private keys, build output, or local editor files.
- Prefer existing component, API, and styling patterns.
- Update docs when changing setup, scripts, environment variables, or release behavior.
- Include screenshots or short screen recordings for visible UI changes when possible.

## Private Keys

MCSR Ranked private keys should never be committed, exposed through `NEXT_PUBLIC_*` environment variables, persisted in browser storage, or included in cache/query keys.
