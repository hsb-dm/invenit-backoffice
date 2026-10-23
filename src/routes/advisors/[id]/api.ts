import type { Action } from '#lib/api/view.js';
export const actions = [
	{
		operation: 'edit',
		label: 'Edit advisor'
	},
	{
		operation: 'assignScheme',
		label: 'Assign scheme'
	},
	{
		operation: 'suspend',
		label: 'Suspend advisor'
	}
] satisfies Action[];
