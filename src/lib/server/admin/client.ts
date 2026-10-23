import * as env from '$app/env/private';

export class AdminApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public code?: string
	) {
		super(message);
	}
}

export async function upstream<T>(
	path: string,
	options: {
		method?: string;
		body?: unknown;
		token?: string;
		fetch?: typeof fetch;
	} = {}
): Promise<T> {
	const base = env.ADMIN_API_BASE_URL;
	if (!base) throw new AdminApiError(503, 'Admin API is not configured.');
	try {
		const response = await (options.fetch ?? fetch)(new URL(path, base), {
			method: options.method ?? 'GET',
			headers: {
				Accept: 'application/json',
				...(options.token ? { satoken: options.token } : {}),
				...(options.body === undefined ? {} : { 'Content-Type': 'application/json' })
			},
			body: options.body === undefined ? undefined : JSON.stringify(options.body),
			signal: AbortSignal.timeout(15000),
			redirect: 'error'
		});
		const envelope = await response.json().catch(() => null);
		if (
			!response.ok ||
			!envelope ||
			['error', 'fail', 'failed'].includes(String(envelope.status).toLowerCase())
		) {
			throw new AdminApiError(
				response.ok ? 422 : response.status,
				envelope?.message || 'Admin API request failed.',
				envelope?.code
			);
		}
		return envelope.data as T;
	} catch (error) {
		if (error instanceof AdminApiError) throw error;
		throw new AdminApiError(502, 'Admin API is unavailable. Please try again.');
	}
}
