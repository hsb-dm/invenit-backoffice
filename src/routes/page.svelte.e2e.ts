import { expect, test } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
	await page.goto('/login');
	await page.getByLabel('Username').fill('tester');
	await page.getByLabel('Password', { exact: true }).fill('test-password');
	await page.getByRole('button', { name: 'Continue', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: 'Authenticator code' });
	await dialog.getByLabel('6-digit code').fill('123456');
	await dialog.getByRole('button', { name: 'Continue', exact: true }).click();
	await expect(page).toHaveURL('/');
}

test.beforeEach(async ({ page }) => {
	await page.request.post('http://127.0.0.1:4311/__reset');
	await login(page);
});

test('server filters, pagination, row IDs and mutation refresh work', async ({ page }) => {
	await page.goto('/clients');
	await expect(page.getByRole('cell', { name: 'API Client', exact: true })).toBeVisible();
	await page.getByRole('button', { name: 'Next', exact: true }).click();
	await expect(page.getByRole('cell', { name: 'Second page client' })).toBeVisible();
	await page.getByRole('link', { name: 'Open', exact: true }).click();
	await expect(page).toHaveURL('/clients/43');
	await page.goto('/clients/42');
	await page.getByRole('button', { name: 'Edit contact', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await dialog.getByLabel('Email').fill('updated@example.test');
	await dialog.getByLabel('Confirm this action').check();
	await dialog.getByRole('button', { name: 'Confirm', exact: true }).click();
	await expect(dialog.getByRole('status')).toContainText('successfully');
	await dialog.getByRole('button', { name: 'Close', exact: true }).click();
	await expect(page.getByText('updated@example.test', { exact: true })).toBeVisible();
	await page.goto('/clients');
	await page.getByLabel('Search', { exact: true }).fill('Filtered client');
	await page.getByRole('button', { name: 'Search', exact: true }).click();
	await expect(page.getByRole('cell', { name: 'Filtered client' })).toBeVisible();
});

test('backend permission errors are displayed and unavailable features have no mock data', async ({
	page
}) => {
	await page.goto('/clients/403');
	await page.getByRole('button', { name: 'Block', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await dialog.getByLabel('Confirm this action').check();
	await dialog.getByRole('button', { name: 'Confirm', exact: true }).click();
	await expect(dialog.getByRole('alert')).toContainText('permission');
	for (const route of [
		'/trading-accounts',
		'/finance/billing-periods',
		'/finance/advisor-wallets',
		'/finance/withdrawals'
	]) {
		await page.goto(route);
		await expect(page.getByRole('heading', { name: 'API belum tersedia' })).toBeVisible();
		await expect(page.locator('tbody tr')).toHaveCount(0);
	}
});

test('OTP codes display by default regardless of status or expiry', async ({ page }) => {
	await page.goto('/clients/otp-log');
	await expect(page.getByRole('cell', { name: '654321', exact: true })).toBeVisible();
	await expect(page.getByRole('cell', { name: '987654', exact: true })).toBeVisible();
	await expect(page.getByRole('cell', { name: '112233', exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Reveal', exact: true })).toHaveCount(0);
	await page.getByLabel('Phone', { exact: true }).fill('628999999999');
	await page.getByRole('button', { name: 'Search', exact: true }).click();
	await expect(page.getByRole('cell', { name: '628999999999', exact: true })).toHaveCount(3);
	await page.getByRole('button', { name: 'Reset', exact: true }).click();
	await expect(page.getByLabel('Phone', { exact: true })).toHaveValue('');
	await expect(page.getByRole('cell', { name: '628123456789', exact: true })).toHaveCount(3);
});

test('all MVP pages render and removed routes remain absent', async ({ page }) => {
	for (const route of [
		'/',
		'/kyc-review',
		'/kyc-review/42',
		'/clients',
		'/clients/42',
		'/clients/otp-log',
		'/advisors',
		'/advisors/7',
		'/products',
		'/products/12',
		'/subscriptions',
		'/subscriptions/1',
		'/finance/payments-refunds',
		'/system/users-roles',
		'/system/menus-dictionary'
	]) {
		await page.goto(route);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	}
	expect((await page.goto('/system/engine-health'))?.status()).toBe(404);
	expect((await page.goto('/partnership/relationships'))?.status()).toBe(404);
});

test('desktop visual regression', async ({ page }) => {
	for (const route of [
		'/',
		'/clients',
		'/clients/42',
		'/kyc-review',
		'/products',
		'/finance/payments-refunds'
	]) {
		await page.goto(route);
		await expect(page.getByRole('status')).toHaveCount(0);
		await expect(page).toHaveScreenshot(
			`${route === '/' ? 'dashboard' : route.slice(1).replaceAll('/', '-')}.png`,
			{ fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.01 }
		);
	}
});

test('server rejects cross-origin writes, invalid bodies, and conflicts', async ({ page }) => {
	const origin = new URL(page.url()).origin;
	const csrf = await page.request.post('/api/admin/clients/42/block', {
		headers: { origin: 'https://other.example.test' },
		data: { reason: 'test' }
	});
	expect(csrf.status()).toBe(403);
	const invalid = await page.request.patch('/api/admin/clients/42', {
		headers: { origin },
		data: { email: 'valid@example.test', token: 'injected' }
	});
	expect(invalid.status()).toBe(400);
	const conflict = await page.request.post('/api/admin/clients/409/block', {
		headers: { origin },
		data: { reason: 'test' }
	});
	expect(conflict.status()).toBe(409);
	expect((await page.request.get('/api/admin/otp')).status()).toBe(200);
	const details = await page.request.get('/api/admin/kyc/42');
	expect(await details.text()).not.toContain('https://example.test/ktp.png');
});

test('an upstream 401 clears the session and returns to login', async ({ page, context }) => {
	await page.goto('/clients');
	await page.getByLabel('Search', { exact: true }).fill('expired');
	await page.getByRole('button', { name: 'Search', exact: true }).click();
	await expect(page).toHaveURL('/login');
	expect((await context.cookies()).some((cookie) => cookie.name === 'invenit_admin_session')).toBe(
		false
	);
});

test('refund request and approval require separate confirmed mutations', async ({ page }) => {
	await page.goto('/finance/payments-refunds');
	await page.getByRole('button', { name: 'Request refund', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: 'Request refund' });
	await dialog.getByLabel('Reason').fill('Duplicate payment');
	await dialog.getByLabel('Confirm this action').check();
	const sent = page.waitForRequest('/api/admin/payments/10/refund');
	await dialog.getByRole('button', { name: 'Confirm', exact: true }).click();
	expect((await sent).postDataJSON()).toEqual({ reason: 'Duplicate payment' });
	await expect(dialog.getByRole('status')).toContainText('successfully');
	await dialog.getByRole('button', { name: 'Close', exact: true }).click();
	await page.getByRole('button', { name: 'Approve refund', exact: true }).click();
	const approval = page.getByRole('dialog', { name: 'Approve refund' });
	await expect(approval.getByRole('button', { name: 'Confirm', exact: true })).toBeDisabled();
	await approval.getByLabel('Confirm this action').check();
	const approved = page.waitForRequest('/api/admin/payments/10/refund/approve');
	await approval.getByRole('button', { name: 'Confirm', exact: true }).click();
	expect((await approved).method()).toBe('POST');
	await expect(approval.getByRole('status')).toContainText('successfully');
});
