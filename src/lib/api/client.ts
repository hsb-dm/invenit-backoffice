import type { operations as ApiOperations } from './schema';
import { operations, type OperationId } from './contract';

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
	}
}
export async function request<T>(
	url: string,
	method = 'GET',
	body?: unknown,
	signal?: AbortSignal
): Promise<T> {
	const response = await fetch(url, {
		method,
		signal,
		headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		body: body === undefined ? undefined : JSON.stringify(body)
	});
	const data = await response.json().catch(() => null);
	if (!response.ok) {
		if (response.status === 401 && !url.startsWith('/api/auth/'))
			window.dispatchEvent(new Event('session-expired'));
		throw new ApiError(response.status, data?.message ?? 'Unable to complete the request.');
	}
	return data;
}
type ResponseData<K extends keyof ApiOperations> = ApiOperations[K]['responses'] extends {
	200: { content: { '*/*': { data?: infer D } } };
}
	? D
	: unknown;
export function call<K extends OperationId>(
	id: K,
	params: Record<string, string | number> = {},
	query: Record<string, string | number> = {},
	body?: unknown,
	signal?: AbortSignal
): Promise<ResponseData<K & keyof ApiOperations>> {
	const operation = operations[id];
	let url: string = operation.path;
	for (const [key, value] of Object.entries(params))
		url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
	const search = new URLSearchParams(
		Object.entries(query)
			.filter(([, v]) => v !== '')
			.map(([k, v]) => [k, String(v)])
	);
	if (search.size) url += `?${search}`;
	return request(url, operation.method, operation.method === 'GET' ? undefined : body, signal);
}
