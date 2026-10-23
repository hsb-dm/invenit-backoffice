import type { Action } from '#lib/api/view.js';
export const actions = [
	{
		operation: 'patch',
		label: 'Edit contact'
	},
	{
		operation: 'block',
		label: 'Block'
	},
	{
		operation: 'unblock',
		label: 'Unblock'
	},
	{
		operation: 'logout',
		label: 'Force logout'
	},
	{
		operation: 'resetLink',
		label: 'Send reset link'
	},
	{
		operation: 'brokerSync',
		label: 'Sync broker accounts'
	}
] satisfies Action[];
