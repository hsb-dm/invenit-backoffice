# Admin API integration

The application uses the pinned UAT contract in `openapi/admin.json`. Run `pnpm api:generate` after replacing that document to regenerate DTOs and explicit server endpoints. Only operations used by the Backoffice MVP are included. Handwritten auth and document endpoints are preserved by generation.

## Local setup

Copy `.env.example` to `.env`. Set `ADMIN_API_BASE_URL` to the Admin API origin and `SESSION_SECRET` to a random value of at least 32 characters. Keep the secret stable across server instances and restarts. Run `pnpm dev`, then log in with an actual admin username, password, and authenticator code. No admin credentials belong in environment files or source control.

Browser queries and mutations use TanStack Svelte Query and same-origin `/api/admin/*` endpoints. Those explicit handlers validate parameters and request bodies, forward the encrypted session's token as `satoken`, and normalize errors. Native fetch is confined to the browser transport and server transport. Pages own their domain layout, columns, and action configuration; forms and tables share presentation components.

The app stores only encrypted cookies for the pending two-factor ticket and upstream session. Cookies are HttpOnly, SameSite Strict, and Secure on HTTPS. Protected page responses and API responses use `Cache-Control: no-store`. An upstream 401 clears both cookies and the browser query cache. Mutations require a matching Origin header, have no automatic retries or optimistic success, and invalidate related resources after success.

## Contract limits

- Trading accounts, billing periods, advisor wallets, and withdrawals have no endpoints in this Swagger document. Their pages remain unavailable without mock records or active actions.
- Graphs, integration health, exports, and unsupported filters/actions are omitted until documented APIs exist.
- OpenAPI reuses the schema name `Row` across unrelated lists; it currently describes a statistics diff even where payment/product/subscription rows are expected. Column mappings stay local to each page and absent fields display `—`. Backend response compatibility needs UAT verification.
- Numeric status/purpose/channel values have no documented enum labels. The UI displays their values rather than inventing meanings. KYC decisions use the documented pattern and backend `allowedDecisions`; subscription actions use backend `allowedActions`.
- Swagger has no `me` or effective-permissions endpoint and no `x-permission` definition. Navigation is static, the sidebar shows the submitted username, and backend 403 responses decide authorization. Validate role enforcement in UAT, especially OTP access and two-person approval operations.
- OTP logs load immediately with pagination; phone and the other search filters are optional. All codes returned by the backend are displayed by default, regardless of status or expiry. The frontend does not fabricate codes omitted by the backend. There is no export or persistent query cache. Identity document URLs are requested on demand and cleared on close.

## Validation

`pnpm check`, `pnpm lint`, `pnpm build`, `pnpm exec vitest run --project server`, and `pnpm test:e2e` validate types, transport, cookie tampering, request validation, and browser workflows. Playwright starts a local upstream fixture and supplies test-only environment settings; it never uses real UAT credentials. Real UAT account and authorization checks are performed manually by the account owner.
