import type { Action } from '#lib/api/view.js';
export const actions = [
	{
		operation: 'assign',
		label: 'Assign'
	},
	{
		operation: 'decide',
		label: 'Decision',
		optionsFrom: { field: 'decision', key: 'allowedDecisions' }
	},
	{
		operation: 'reopen',
		label: 'Reopen case'
	}
] satisfies Action[];
