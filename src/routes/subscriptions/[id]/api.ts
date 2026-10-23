import type { Action } from '#lib/api/view.js';
export const actions = [
	{
		operation: 'act',
		label: 'Subscription action',
		optionsFrom: { field: 'action', key: 'allowedActions' }
	},
	{
		operation: 'reconcile',
		label: 'Reconcile'
	}
] satisfies Action[];
