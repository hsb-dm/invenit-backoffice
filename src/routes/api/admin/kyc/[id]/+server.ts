// Generated explicit endpoint; regenerate with pnpm api:generate.
import type { RequestHandler } from './$types';
import { handleOperation } from '#lib/server/admin/handler.js';

export const GET: RequestHandler = (event) => handleOperation(event, 'caseDetail');
