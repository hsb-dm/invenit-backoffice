import { json, redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';
import { sessionCookie, unseal, type AdminSession } from '#lib/server/admin/session.js';

export const handle: Handle = async ({ event, resolve }) => {
	const session = unseal<AdminSession>(event.cookies.get(sessionCookie));
	event.locals.admin = session?.token ? session : undefined;
	const path = event.url.pathname;
	if (path.startsWith('/api/') && !['GET', 'HEAD', 'OPTIONS'].includes(event.request.method)) {
		if (event.request.headers.get('origin') !== event.url.origin)
			return json({ message: 'Invalid request origin.' }, { status: 403 });
	}
	const publicRoute = path === '/login' || path.startsWith('/api/auth/');
	if (event.route.id && !publicRoute && !event.locals.admin) {
		if (path.startsWith('/api/')) return json({ message: 'Please log in.' }, { status: 401 });
		redirect(303, '/login');
	}
	const response = await resolve(event);
	if (event.route.id) response.headers.set('cache-control', 'no-store');
	return response;
};
