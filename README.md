# INvenit Backoffice

SvelteKit 3, Svelte 5, TypeScript, and TanStack Svelte Query. The app connects to the Admin API through explicit SvelteKit server endpoints and encrypted HttpOnly session cookies.

## Run locally

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env` and set the private API origin and a random session secret of at least 32 characters.
3. Run `pnpm dev` and open `/login`. Use your admin credentials and Google Authenticator code.

No credentials are stored in the repository. See [API integration and known contract gaps](docs/admin-api.md).

## Checks

```sh
pnpm check
pnpm lint
pnpm build
pnpm exec vitest run --project server
pnpm test:e2e
```

Browser tests start a local API fixture; they never call UAT. Regenerate API types and explicit resource endpoints with `pnpm api:generate` after updating `openapi/admin.json`.

## Production

The Node adapter builds the server into `build/`. Provide `ADMIN_API_BASE_URL`, `SESSION_SECRET`, and the deployment origin in the runtime environment, then run `pnpm start`. Keep the session secret stable across instances. HTTPS is required for Secure cookies in deployment.
