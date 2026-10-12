import { expect, test } from '@playwright/test';

const routes = [
	['/', 'Dashboard'],
	['/kyc-review', 'KYC review'],
	['/kyc-review/10000503', 'KYC review · 10000503 · SARI MELATI'],
	['/clients', 'Clients'],
	['/clients/10000482', 'Budi Santoso · 10000482'],
	['/trading-accounts', 'Trading accounts'],
	['/trading-accounts/771002', 'Verify account · 771002 @ BrokerB'],
	['/advisors', 'Advisors'],
	['/advisors/7', 'PT Nusantara Advisory · advisor 7'],
	['/products', 'Products'],
	['/products/12', 'Atlas Trend · product 12'],
	['/subscriptions', 'Subscriptions'],
	['/subscriptions/sub-2201', 'SUB-2201 · Atlas Trend'],
	['/finance/payments-refunds', 'Payments & refunds'],
	['/finance/billing-periods', 'Billing periods'],
	['/finance/advisor-wallets', 'Advisor wallets'],
	['/finance/withdrawals', 'Withdrawals'],
	['/finance/ib-import', 'IB import'],
	['/partnership/relationships', 'Partnership · referral relationships'],
	['/partnership/schemes-rewards', 'Referral schemes & rewards'],
	['/system/users-roles', 'Users & roles'],
	['/system/menus-dictionary', 'Menus & dictionary'],
	['/system/config-kill-switch', 'Config & kill switch'],
	['/system/audit-log', 'Audit log'],
	['/system/engine-health', 'Engine health']
] as const;

test('all Figma screens are addressable', async ({ page }) => {
	for (const [route, heading] of routes) {
		await page.goto(route);
		await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
	}
});

test('navigation, search, tabs and local actions work', async ({ page }) => {
	await page.goto('/clients');
	await page.getByPlaceholder('Search clients').fill('Sari');
	await expect(page.getByRole('cell', { name: 'Sari Melati' })).toBeVisible();
	await expect(page.getByRole('cell', { name: 'Budi Santoso' })).toBeHidden();

	await page.getByRole('link', { name: 'Open' }).first().click();
	await expect(page).toHaveURL('/clients/10000482');
	await page.getByRole('tab', { name: 'KYC', exact: true }).click();
	await expect(page.getByRole('tab', { name: 'KYC', exact: true })).toHaveAttribute(
		'aria-selected',
		'true'
	);

	await page.goto('/system/config-kill-switch');
	await page.getByRole('button', { name: /2 · Read-only/ }).click();
	await expect(page.getByRole('button', { name: /2 · Read-only/ })).toHaveClass(/selected/);
});

test('desktop visual regression', async ({ page }) => {
	for (const [route] of routes) {
		await page.goto(route);
		await expect(page).toHaveScreenshot(
			`${route === '/' ? 'dashboard' : route.slice(1).replaceAll('/', '-')}.png`,
			{
				fullPage: true,
				animations: 'disabled',
				threshold: 0.2,
				maxDiffPixelRatio: 0.01
			}
		);
	}
});
