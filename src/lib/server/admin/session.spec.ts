import { expect, test, vi } from 'vitest';

vi.mock('$app/env/private', () => ({ SESSION_SECRET: '' }));
import { assertSessionConfigured, seal } from './session.js';

test('missing session configuration produces a service error before encryption', () => {
	expect(assertSessionConfigured).toThrow('server session configuration');
	expect(() => seal({ ticket: 'private' })).toThrowError(expect.objectContaining({ status: 503 }));
});
