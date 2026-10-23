import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import * as env from '$app/env/private';
import type { Cookies } from '@sveltejs/kit';
import { AdminApiError } from './client.js';

export const sessionCookie = 'invenit_admin_session';
export const ticketCookie = 'invenit_admin_ticket';
export type AdminSession = { token: string; username: string };

export function assertSessionConfigured() {
	if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
		throw new AdminApiError(
			503,
			'Login is unavailable: server session configuration is missing or invalid.'
		);
	}
	return env.SESSION_SECRET;
}

function key() {
	return createHash('sha256').update(assertSessionConfigured()).digest();
}

export function seal(value: unknown) {
	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', key(), iv);
	const data = Buffer.concat([cipher.update(JSON.stringify(value), 'utf8'), cipher.final()]);
	return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64url');
}

export function unseal<T>(value: string | undefined): T | undefined {
	if (!value) return;
	try {
		const buffer = Buffer.from(value, 'base64url');
		const cipher = createDecipheriv('aes-256-gcm', key(), buffer.subarray(0, 12));
		cipher.setAuthTag(buffer.subarray(12, 28));
		return JSON.parse(
			Buffer.concat([cipher.update(buffer.subarray(28)), cipher.final()]).toString()
		);
	} catch {
		return;
	}
}

export function setPrivateCookie(
	cookies: Cookies,
	name: string,
	value: unknown,
	url: URL,
	maxAge?: number
) {
	cookies.set(name, seal(value), {
		path: '/',
		httpOnly: true,
		secure: url.protocol === 'https:',
		sameSite: 'strict',
		...(maxAge === undefined ? {} : { maxAge })
	});
}
