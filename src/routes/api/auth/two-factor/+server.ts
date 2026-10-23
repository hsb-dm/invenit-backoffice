import type { RequestHandler } from './$types';
import type { components } from '#lib/api/schema.js';
import { upstream, AdminApiError } from '#lib/server/admin/client.js';
import { respond, readObject } from '#lib/server/admin/handler.js';
import {
	setPrivateCookie,
	sessionCookie,
	ticketCookie,
	unseal
} from '#lib/server/admin/session.js';

export const POST: RequestHandler = (event) =>
	respond(event, async () => {
		const ticket = unseal<{ ticket: string; username: string; expiresAt: number }>(
			event.cookies.get(ticketCookie)
		);
		if (!ticket || ticket.expiresAt < Date.now()) {
			event.cookies.delete(ticketCookie, { path: '/' });
			throw new AdminApiError(401, 'Login expired. Enter your credentials again.');
		}
		const { code } = await readObject(event);
		if (typeof code !== 'string' || !/^\d{6}$/.test(code))
			throw new AdminApiError(400, 'Enter a 6-digit authenticator code.');
		const result = await upstream<components['schemas']['TwoFactorData']>('/admin/auth/2fa', {
			method: 'POST',
			body: { ticket: ticket.ticket, code }
		});
		if (!result?.tokenValue) throw new AdminApiError(502, 'The server did not return a session.');
		setPrivateCookie(
			event.cookies,
			sessionCookie,
			{ token: result.tokenValue, username: ticket.username },
			event.url
		);
		event.cookies.delete(ticketCookie, { path: '/' });
		return { authenticated: true };
	});
