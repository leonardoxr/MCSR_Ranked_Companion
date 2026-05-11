# Security Policy

## Reporting a Vulnerability

Please do not open a public issue for suspected vulnerabilities.

Email the maintainer or use GitHub's private vulnerability reporting if it is enabled for the repository. Include:

- Affected version or commit
- Steps to reproduce
- Expected and actual impact
- Any suggested fix or mitigation

## Dependency Checks

Before public releases, run:

```bash
npm audit --omit=dev
npm run build
```

## Secrets

This project is a client-rendered application. Anything in a `NEXT_PUBLIC_*` variable can be sent to browsers, so do not store private API keys there.

User-provided MCSR Ranked private keys should remain session-scoped. Do not persist them to localStorage/sessionStorage, include them in React Query keys, print them to logs, or send them anywhere except the MCSR Ranked API `Private-Key` header.

## Deployment Controls

Vercel Git auto-deployments are disabled in `vercel.json`. Do not re-enable them unless fork and pull-request deployment behavior has been reviewed.

Only the trusted GitHub Actions production deployment workflow should receive Vercel secrets. Do not expose `VERCEL_TOKEN`, `VERCEL_ORG_ID`, or `VERCEL_PROJECT_ID` to pull request workflows.
