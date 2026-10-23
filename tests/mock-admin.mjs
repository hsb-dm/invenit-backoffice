import { createServer } from 'node:http';

let email = 'client@example.test';
const server = createServer(async (req, res) => {
	const url = new URL(req.url, 'http://localhost');
	const path = url.pathname;
	let text = '';
	for await (const chunk of req) text += chunk;
	const body = text ? JSON.parse(text) : {};
	function send(data, status = 200, message) {
		res.writeHead(status, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ status: status < 400 ? 'success' : 'error', data, message }));
	}
	if (path === '/__reset') {
		email = 'client@example.test';
		return send(null);
	}
	if (path === '/admin/auth/login') {
		if (body.username !== 'tester' || body.password !== 'test-password')
			return send(null, 401, 'Invalid credentials.');
		return send({ ticket: 'test-ticket', twoFactorRequired: true });
	}
	if (path === '/admin/auth/2fa') {
		if (body.ticket !== 'test-ticket' || body.code !== '123456')
			return send(null, 401, 'Invalid authenticator code.');
		return send({ tokenName: 'satoken', tokenValue: 'test-upstream-token' });
	}
	if (req.headers.satoken !== 'test-upstream-token') return send(null, 401, 'Session expired.');
	if (path === '/admin/auth/logout') return send(null);
	if (url.searchParams.get('q') === 'expired') return send(null, 401, 'Session expired.');
	if (url.searchParams.get('q') === 'server-error') return send(null, 500, 'Service unavailable.');
	if (path === '/admin/dashboard')
		return send({
			queue: { kycOpen: 3, kycBreached: 1, paymentsPending: 2, refundsPending: 0 },
			money: { mrrIdr: 1000000, paidTodayIdr: 200000, activeSubscriptions: 20 }
		});
	if (path === '/admin/clients') {
		const page = Number(url.searchParams.get('page') || 1);
		return send({
			items: [
				{
					clientId: page === 1 ? 42 : 43,
					name: url.searchParams.get('q') || (page === 1 ? 'API Client' : 'Second page client'),
					phone: '628123456789',
					status: 1,
					kycStatus: 2,
					createdAt: '2026-10-01T00:00:00Z'
				}
			],
			total: 100
		});
	}
	if (path === '/admin/payments')
		return send({
			items: [
				{
					id: 10,
					clientId: 42,
					amountIdr: 100000,
					method: 1,
					status: 1,
					paidAt: '2026-10-01T00:00:00Z'
				}
			],
			total: 1
		});
	if (path === '/admin/clients/403/block') return send(null, 403, 'You do not have permission.');
	if (path === '/admin/clients/409/block') return send(null, 409, 'Record has changed.');
	if (path === '/admin/clients/999') return send(null, 404, 'Client not found.');
	if (path === '/admin/clients/42' && req.method === 'PATCH') {
		email = body.email;
		return send(null);
	}
	if (/^\/admin\/clients\/\d+$/.test(path))
		return send({
			clientId: Number(path.split('/').at(-1)),
			fullName: 'API Client',
			phone: '628123456789',
			email,
			status: 1,
			kycStatus: 2,
			allowedActions: ['block', 'unblock']
		});
	if (path.endsWith('/ktp-url')) return send('https://example.test/identity.png');
	if (path === '/admin/otp')
		return send({
			items: [
				{
					id: 3,
					phone: url.searchParams.get('phone') || '628123456789',
					code: '112233',
					status: 1,
					channel: 1,
					purpose: 1,
					expiresAt: new Date(Date.now() - 60000).toISOString(),
					usedAt: '2026-10-01T00:00:00Z'
				},
				{
					id: 1,
					phone: url.searchParams.get('phone') || '628123456789',
					code: '654321',
					status: 0,
					channel: 1,
					purpose: 1,
					attemptCount: 0,
					expiresAt: new Date(Date.now() + 60000).toISOString()
				},
				{
					id: 2,
					phone: url.searchParams.get('phone') || '628123456789',
					code: '987654',
					status: 0,
					channel: 1,
					purpose: 1,
					attemptCount: 0,
					expiresAt: new Date(Date.now() - 60000).toISOString()
				}
			]
		});
	if (path === '/admin/kyc/queue')
		return send({
			items: [
				{ clientId: 42, name: 'API Client', reason: 'Review', assignedTo: '', slaLeftMin: 60 }
			],
			total: 1
		});
	if (/^\/admin\/kyc\/\d+$/.test(path))
		return send({
			typed: { name: 'API Client' },
			ocr: { name: 'API Client' },
			documents: {
				ktpUrl: 'https://example.test/ktp.png',
				selfieUrl: 'https://example.test/selfie.png'
			},
			allowedDecisions: ['approve', 'reject', 'request_selfie']
		});
	if (/^\/admin\/subscriptions\/\d+$/.test(path))
		return send({
			subscription: { id: 1, clientId: 42, productId: 12, status: 2 },
			payments: [],
			billingPeriods: [],
			allowedActions: ['pause', 'resume']
		});
	if (/^\/admin\/products\/\d+$/.test(path))
		return send({ id: 12, name: 'API Product', status: 1, allowedActions: ['publish'] });
	if (/^\/admin\/advisors\/\d+$/.test(path))
		return send({
			advisor: { id: 7, displayName: 'API Advisor' },
			products: [],
			schemeHistory: [],
			wallet: { balanceNetIdr: 0 }
		});
	if (req.method !== 'GET') return send(null);
	if (['/admin/users', '/admin/roles', '/admin/menus', '/admin/dictionary'].includes(path))
		return send([]);
	return send({ items: [], total: 0 });
});
server.listen(4311, '127.0.0.1');
