import type { Action } from '#lib/api/view.js';
export const actions = [
	{
		operation: 'update',
		label: 'Edit product'
	},
	{
		operation: 'pricing',
		label: 'Set pricing'
	},
	{
		operation: 'submit',
		label: 'Submit'
	},
	{
		operation: 'publish',
		label: 'Publish'
	},
	{
		operation: 'feature',
		label: 'Feature'
	},
	{
		operation: 'riskTier',
		label: 'Change risk tier'
	},
	{
		operation: 'addMaster',
		label: 'Add master'
	},
	{
		operation: 'updateMaster',
		label: 'Update master'
	},
	{
		operation: 'testPass',
		label: 'Pass test'
	},
	{
		operation: 'testFail',
		label: 'Fail test'
	},
	{
		operation: 'stats',
		label: 'Import statistics'
	}
] satisfies Action[];
