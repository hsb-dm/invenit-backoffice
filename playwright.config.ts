import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'npm run build && npm run preview', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}',
	use: {
		channel: 'chrome',
		viewport: { width: 1440, height: 1000 }
	}
});
