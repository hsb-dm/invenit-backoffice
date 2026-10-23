import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: [
		{ command: 'node tests/mock-admin.mjs', port: 4311 },
		{
			command: 'npm run build && npm run preview -- --port 4174',
			port: 4174,
			env: {
				ADMIN_API_BASE_URL: 'http://127.0.0.1:4311',
				SESSION_SECRET: 'test-only-secret-not-for-real-environments-12345'
			}
		}
	],
	testMatch: '**/*.e2e.{ts,js}',
	use: {
		baseURL: 'http://localhost:4174',
		channel: 'chrome',
		viewport: { width: 1440, height: 1000 }
	}
});
