import type { RequestHandler } from './$types';
import type { components } from '#lib/api/schema.js';
import { respond } from '#lib/server/admin/handler.js';
import { upstream, AdminApiError } from '#lib/server/admin/client.js';
export const GET: RequestHandler = (event) =>
	respond(event, async () => {
		if (!event.locals.admin) throw new AdminApiError(401, 'Please log in.');
		if (!/^\d+$/.test(event.params.id)) throw new AdminApiError(400, 'Invalid client ID.');
		const data = await upstream<components['schemas']['KycCaseResponse']>(
			`/admin/kyc/${event.params.id}`,
			{ token: event.locals.admin.token }
		);
		return data?.documents ?? {};
	});
