import type { RequestHandler } from './$types';
import type { components } from '#lib/api/schema.js';
import { upstream, AdminApiError } from '#lib/server/admin/client.js';
import { respond, readObject, validate } from '#lib/server/admin/handler.js';
import {
	assertSessionConfigured,
	setPrivateCookie,
	ticketCookie
} from '#lib/server/admin/session.js';

export const POST: RequestHandler = (event) =>
	respond(event, async () => {
		assertSessionConfigured();
		const body = await readObject(event);
		validate(body, {
			type: 'object',
			required: ['username', 'password'],
			properties: {
				username: { type: 'string', minLength: 1 },
				password: { type: 'string', minLength: 1 }
			}
		});
		event.cookies.delete(ticketCookie, { path: '/' });
		const result = await upstream<components['schemas']['LoginData']>('/admin/auth/login', {
			method: 'POST',
			body
		});
		if (!result?.ticket)
			throw new AdminApiError(502, 'The server did not return a two-factor ticket.');
		setPrivateCookie(
			event.cookies,
			ticketCookie,
			{ ticket: result.ticket, username: body.username, expiresAt: Date.now() + 300000 },
			event.url,
			300
		);
		return { twoFactorRequired: true };
	});
