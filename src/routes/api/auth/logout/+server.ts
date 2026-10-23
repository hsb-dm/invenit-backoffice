import type { RequestHandler } from './$types';
import { upstream } from '#lib/server/admin/client.js';
import { respond } from '#lib/server/admin/handler.js';
import { sessionCookie, ticketCookie } from '#lib/server/admin/session.js';

export const POST: RequestHandler = (event) =>
	respond(event, async () => {
		try {
			if (event.locals.admin)
				await upstream('/admin/auth/logout', { method: 'POST', token: event.locals.admin.token });
		} finally {
			event.cookies.delete(sessionCookie, { path: '/' });
			event.cookies.delete(ticketCookie, { path: '/' });
		}
		return { authenticated: false };
	});
