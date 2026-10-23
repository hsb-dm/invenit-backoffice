import { describe, it, expect, vi, afterEach } from 'vitest';
vi.mock('$app/env/private', () => ({
	ADMIN_API_BASE_URL: 'https://admin.example.test',
	SESSION_SECRET: 'unit-test-secret-at-least-32-characters'
}));
import { upstream, AdminApiError } from './client.js';
import { seal, unseal } from './session.js';
import { validate } from './handler.js';

afterEach(() => vi.restoreAllMocks());
describe('admin transport and session boundary', () => {
	it('sends only the upstream token header and unwraps the contract envelope', async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ status: 'success', data: { items: [], total: 0 } }))
			);
		expect(
			await upstream('/admin/clients?page=2', { token: 'private-token', fetch: fetcher })
		).toEqual({ items: [], total: 0 });
		expect(fetcher.mock.calls[0][0].href).toBe('https://admin.example.test/admin/clients?page=2');
		expect(fetcher.mock.calls[0][1].headers).toEqual({
			Accept: 'application/json',
			satoken: 'private-token'
		});
	});
	it.each([401, 403, 409, 500])(
		'preserves HTTP %s without converting failure to success',
		async (status) => {
			const fetcher = vi
				.fn()
				.mockResolvedValue(
					new Response(JSON.stringify({ status: 'error', message: 'Denied' }), { status })
				);
			await expect(upstream('/admin/clients', { fetch: fetcher })).rejects.toMatchObject({
				status,
				message: 'Denied'
			});
		}
	);
	it('rejects an error envelope even with HTTP 200', async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ status: 'error', message: 'Invalid action' }))
			);
		await expect(upstream('/admin/clients', { fetch: fetcher })).rejects.toBeInstanceOf(
			AdminApiError
		);
	});
	it('encrypts cookies and rejects tampering', () => {
		const cookie = seal({ token: 'secret-token' });
		expect(cookie).not.toContain('secret-token');
		expect(unseal(cookie)).toEqual({ token: 'secret-token' });
		expect(unseal(cookie.slice(0, 20) + 'tampered' + cookie.slice(28))).toBeUndefined();
	});
	it('validates nested request bodies and unknown fields', () => {
		const schema = {
			type: 'object',
			required: ['ids'],
			properties: { ids: { type: 'array', items: { type: 'integer' } } }
		};
		expect(() => validate({ ids: [42, 43] }, schema)).not.toThrow();
		expect(() => validate({ ids: ['42'] }, schema)).toThrow();
		expect(() => validate({ ids: [42], token: 'injected' }, schema)).toThrow();
	});
});
