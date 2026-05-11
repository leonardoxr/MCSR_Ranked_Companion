# MCSR Ranked Companion

A fast web and desktop companion for MCSR Ranked players. Browse leaderboards, search player profiles, inspect match history, compare players, and follow live matches from the MCSR Ranked API.

## Features

- Player profiles with ELO, rank, season stats, achievements, and match history
- Global, phase, record, weekly-race, and playoff leaderboard views
- Head-to-head player comparisons
- Live match viewer with pace and split details
- In-memory private-key support for authenticated MCSR Ranked API requests
- Internationalized UI messages in English, Spanish, Portuguese, and Chinese
- Web build with Next.js and desktop build with Tauri

## Tech Stack

- Next.js 16, React 18, TypeScript
- Tailwind CSS
- TanStack Query, Zustand
- Axios API client for MCSR Ranked
- Recharts and Framer Motion
- Tauri 2 for desktop packaging

## Getting Started

### Requirements

- Node.js 20 or newer
- npm
- Rust and platform prerequisites if you want to run or build the Tauri desktop app

### Install

```bash
git clone https://github.com/leonardoxr/MCSR_Ranked_Companion.git
cd MCSR_Ranked_Companion
npm install
```

Optional local configuration:

```bash
cp .env.example .env.local
```

### Web Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Web Build

```bash
npm run build
npm start
```

### Desktop Development

```bash
npm run tauri:dev
```

### Desktop Build

```bash
npm run tauri:build
```

Build artifacts are written under `src-tauri/target/`.

## Environment Variables

| Name | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Public canonical URL used for metadata, robots, sitemap, and structured data. Defaults to the hosted companion URL. |
| `NEXT_PUBLIC_MCSR_API_BASE_URL` | No | MCSR Ranked API base URL. Defaults to `https://api.mcsrranked.com`. |

Do not put private MCSR Ranked keys in `NEXT_PUBLIC_*` variables. The app accepts user-provided private keys only in the active browser or desktop session and does not persist them to localStorage.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production web app |
| `npm start` | Start the production Next.js server |
| `npm run lint` | Run Next.js linting |
| `npm run type-check` | Run TypeScript without emitting files |
| `npm run tauri:dev` | Run the desktop app in development |
| `npm run tauri:build` | Build desktop installers/packages |
| `npm run fetch:achievements` | Download achievement icons from configured sources |
| `npm run populate:achievements` | Populate achievement source mappings from the wiki |

## Project Structure

```text
src/
  app/          Next.js App Router pages and metadata
  components/   UI, layout, and feature components
  hooks/        Shared React hooks
  i18n/         Locale provider and routing config
  lib/          API client, cache helpers, stores, and utilities
  styles/       Global styles
  types/        Shared TypeScript types
public/         Static assets, fonts, icons, and achievements
src-tauri/      Tauri desktop shell
docs/           Additional project documentation
tests/          API and utility validation files
```

## Release Checklist

Before publishing a release, run:

```bash
npm audit --omit=dev
npm run type-check
npm run build
```

For desktop releases, also run `npm run tauri:build` on each target platform.

## Deployment Safety

Vercel Git auto-deployments are disabled in `vercel.json`. This prevents pull requests, forks, and arbitrary branch pushes from directly creating Vercel deployments through the Vercel Git integration.

Production deploys are handled by `.github/workflows/vercel-deploy.yml`, which only runs on trusted `main` pushes or manual `workflow_dispatch` runs in this repository. Configure these GitHub environment secrets before using it:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Keep GitHub branch protection enabled for `main`, require reviews for `.github/workflows/**` and `vercel.json`, and require approval for the `production` GitHub Environment.

## API

This project uses the MCSR Ranked API. See [MCSR_Ranked_API_Documentation.md](./MCSR_Ranked_API_Documentation.md) for local notes and the upstream [MCSR Ranked docs](https://docs.mcsrranked.com/) for official API information.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for local setup, checks, and contribution expectations.

## Security

Please report suspected vulnerabilities privately. See [SECURITY.md](./SECURITY.md).

## License

MIT. See [LICENSE](./LICENSE).

## Acknowledgments

Thanks to MCSR Ranked and the Minecraft speedrunning community.
