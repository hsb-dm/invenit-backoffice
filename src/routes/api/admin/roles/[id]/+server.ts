// Generated explicit endpoint; regenerate with pnpm api:generate.
import type { RequestHandler } from './$types';
import { handleOperation } from '#lib/server/admin/handler.js';

export const DELETE: RequestHandler = (event) => handleOperation(event, 'deleteRole');
export const PATCH: RequestHandler = (event) => handleOperation(event, 'updateRole');
