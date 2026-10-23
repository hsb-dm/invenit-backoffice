import { operations, type OperationId } from './contract.js';
export function resource(id: OperationId) {
	return operations[id].upstream.split('/')[2];
}
export function queryKey(id: OperationId, ...input: unknown[]) {
	return ['admin', resource(id), id, ...input] as const;
}
export function affectedResources(id: OperationId) {
	const domain = resource(id);
	const related: Record<string, string[]> = {
		clients: ['kyc', 'subscriptions'],
		kyc: ['clients'],
		payments: ['subscriptions'],
		products: ['advisors'],
		advisors: ['products'],
		users: ['roles'],
		roles: ['users', 'menus']
	};
	return new Set([domain, 'dashboard', ...(related[domain] ?? [])]);
}
