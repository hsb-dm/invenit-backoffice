import { expect, test } from '@playwright/test';

test('login validates credentials and establishes a private session after 2FA', async ({
	page,
	context
}) => {
	await page.goto('/');
	await expect(page).toHaveURL('/login');
	await page.getByLabel('Username').fill('tester');
	await page.getByLabel('Password', { exact: true }).fill('wrong');
	await page.getByRole('button', { name: 'Continue', exact: true }).click();
	await expect(page.getByRole('alert')).toContainText('Invalid credentials');
	await page.getByLabel('Password', { exact: true }).fill('test-password');
	const loginResponse = page.waitForResponse('/api/auth/login');
	await page.getByRole('button', { name: 'Continue', exact: true }).click();
	expect(await (await loginResponse).text()).not.toContain('test-ticket');
	const dialog = page.getByRole('dialog', { name: 'Authenticator code' });
	await expect(dialog).toBeVisible();
	await dialog.getByLabel('6-digit code').fill('000000');
	await dialog.getByRole('button', { name: 'Continue', exact: true }).click();
	await expect(dialog.getByRole('alert')).toContainText('Invalid authenticator code');
	await dialog.getByLabel('6-digit code').fill('123456');
	const verifyResponse = page.waitForResponse('/api/auth/two-factor');
	await dialog.getByRole('button', { name: 'Continue', exact: true }).click();
	expect(await (await verifyResponse).text()).not.toContain('test-upstream-token');
	await expect(page).toHaveURL('/');
	await expect(page.getByText('1.000.000')).toBeVisible();
	const cookies = await context.cookies();
	expect(cookies.find((c) => c.name === 'invenit_admin_session')?.httpOnly).toBe(true);
	expect(cookies.find((c) => c.name === 'invenit_admin_session')?.sameSite).toBe('Strict');
	expect(cookies.find((c) => c.name === 'invenit_admin_session')?.value).not.toContain(
		'test-upstream-token'
	);
	expect(await page.content()).not.toContain('test-upstream-token');
	expect(
		await page.evaluate(() => JSON.stringify(localStorage) + JSON.stringify(sessionStorage))
	).not.toContain('test-upstream-token');
	await page.getByRole('button', { name: 'Log out' }).click();
	await expect(page).toHaveURL('/login');
	expect((await context.cookies()).some((c) => c.name === 'invenit_admin_session')).toBe(false);
});

test('login fits a mobile viewport', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/login');
	await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
