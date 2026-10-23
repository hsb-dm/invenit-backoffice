import type { ComponentProps } from 'svelte';
import type ApiList from '#lib/backoffice/ApiList.svelte';
export const config = {
	operation: 'list_2',
	title: 'Payments & refunds',
	columns: [
		{
			key: 'id',
			label: 'Payment ID'
		},
		{
			key: 'clientId',
			label: 'Client'
		},
		{
			key: 'amountIdr',
			label: 'Amount (IDR)'
		},
		{
			key: 'method',
			label: 'Method'
		},
		{
			key: 'status',
			label: 'Status'
		},
		{
			key: 'paidAt',
			label: 'Paid at'
		}
	],
	idKey: 'id',
	actions: [
		{
			operation: 'requery',
			label: 'Requery'
		},
		{
			operation: 'refund',
			label: 'Request refund'
		},
		{
			operation: 'approveRefund',
			label: 'Approve refund'
		},
		{
			operation: 'markPaid',
			label: 'Mark paid'
		}
	],
	create: []
} satisfies ComponentProps<typeof ApiList>;
