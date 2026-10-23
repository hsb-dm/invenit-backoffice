import { json, type RequestEvent } from '@sveltejs/kit';
import { operations, type OperationId } from '#lib/api/contract.js';
import { AdminApiError, upstream } from './client.js';
import { sessionCookie, ticketCookie } from './session.js';

import type { Schema } from '#lib/api/form.js';

export async function readObject(event: RequestEvent): Promise<Record<string, unknown>> {
	const body = await event.request.json().catch(() => {
		throw new AdminApiError(400, 'Invalid request body.');
	});
	if (!body || typeof body !== 'object' || Array.isArray(body))
		throw new AdminApiError(400, 'Request must be an object.');
	return body;
}
export function validate(value: unknown, schema: Schema, name = 'Request'): void {
	if (schema.type === 'object') {
		if (!value || typeof value !== 'object' || Array.isArray(value))
			throw new AdminApiError(400, `${name} must be an object.`);
		const record = value as Record<string, unknown>;
		for (const key of schema.required ?? [])
			if (record[key] === undefined || record[key] === '')
				throw new AdminApiError(400, `${key} is required.`);
		for (const [key, item] of Object.entries(record)) {
			if (!schema.properties?.[key]) throw new AdminApiError(400, `Unknown field: ${key}`);
			validate(item, schema.properties[key], key);
		}
	} else if (schema.type === 'array') {
		if (!Array.isArray(value)) throw new AdminApiError(400, `${name} must be a list.`);
		value.forEach((item) => validate(item, schema.items ?? {}, name));
	} else if (schema.type === 'string') {
		if (
			typeof value !== 'string' ||
			value.length < (schema.minLength ?? 0) ||
			(schema.pattern && !new RegExp(`^(?:${schema.pattern})$`).test(value))
		)
			throw new AdminApiError(400, `${name} is invalid.`);
	} else if (schema.type === 'integer' || schema.type === 'number') {
		if (
			typeof value !== 'number' ||
			!Number.isFinite(value) ||
			(schema.type === 'integer' && !Number.isSafeInteger(value)) ||
			(schema.minimum !== undefined && value < schema.minimum) ||
			(schema.maximum !== undefined && value > schema.maximum)
		)
			throw new AdminApiError(400, `${name} is invalid.`);
	} else if (schema.type === 'boolean' && typeof value !== 'boolean')
		throw new AdminApiError(400, `${name} is invalid.`);
	if (schema.enum && !schema.enum.includes(value))
		throw new AdminApiError(400, `${name} is invalid.`);
}

export async function respond(event: RequestEvent, run: () => Promise<unknown>) {
	try {
		return json(await run(), { headers: { 'cache-control': 'no-store' } });
	} catch (error) {
		const failure =
			error instanceof AdminApiError
				? error
				: new AdminApiError(500, 'Unable to complete the request.');
		if (failure.status === 401 && event.locals.admin) {
			event.cookies.delete(sessionCookie, { path: '/' });
			event.cookies.delete(ticketCookie, { path: '/' });
		}
		return json(
			{ message: failure.message, code: failure.code },
			{ status: failure.status, headers: { 'cache-control': 'no-store' } }
		);
	}
}

export function handleOperation(event: RequestEvent, id: OperationId) {
	return respond(event, async () => {
		if (!event.locals.admin) throw new AdminApiError(401, 'Please log in.');
		const operation = operations[id];
		let path: string = operation.upstream;
		const query = new URLSearchParams();
		for (const parameter of operation.parameters) {
			const value =
				parameter.in === 'path'
					? event.params[parameter.name]
					: event.url.searchParams.get(parameter.name);
			if (parameter.required && !value)
				throw new AdminApiError(400, `${parameter.name} is required.`);
			if (value !== undefined && value !== null && value !== '') {
				if (
					parameter.schema.type === 'integer' &&
					(!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)))
				)
					throw new AdminApiError(400, `${parameter.name} is invalid.`);
				if (parameter.in === 'path')
					path = path.replace(`{${parameter.name}}`, encodeURIComponent(value));
				else query.set(parameter.name, value);
			}
		}
		let body: unknown;
		if ('properties' in operation.schema) {
			body = await event.request.json().catch(() => {
				throw new AdminApiError(400, 'Invalid request body.');
			});
			validate(body, operation.schema as Schema);
		}
		const result = await upstream<Record<string, unknown>>(path + (query.size ? `?${query}` : ''), {
			method: operation.method,
			body,
			token: event.locals.admin.token
		});
		if (id === 'caseDetail' && result?.documents) result.documents = {};
		return result;
	});
}
