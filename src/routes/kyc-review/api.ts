import type { ComponentProps } from 'svelte';
import type ApiList from '#lib/backoffice/ApiList.svelte';
export const config = {
	operation: 'queue',
	title: 'KYC review',
	columns: [
		{
			key: 'clientId',
			label: 'Client ID'
		},
		{
			key: 'name',
			label: 'Name'
		},
		{
			key: 'reason',
			label: 'Reason'
		},
		{
			key: 'submittedAt',
			label: 'Submitted'
		},
		{
			key: 'assignedTo',
			label: 'Assignee'
		},
		{
			key: 'slaLeftMin',
			label: 'SLA (min)'
		}
	],
	idKey: 'clientId',
	actions: [
		{
			operation: 'assign',
			label: 'Assign'
		}
	],
	create: [
		{
			operation: 'bulkAssign',
			label: 'Bulk assign'
		}
	],
	detail: '/kyc-review'
} satisfies ComponentProps<typeof ApiList>;
