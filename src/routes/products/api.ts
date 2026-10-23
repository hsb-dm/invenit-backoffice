import type { ComponentProps } from 'svelte';
import type ApiList from '#lib/backoffice/ApiList.svelte';
export const config = {
	operation: 'list',
	title: 'Products',
	columns: [
		{
			key: 'id',
			label: 'Product ID'
		},
		{
			key: 'name',
			label: 'Name'
		},
		{
			key: 'advisorId',
			label: 'Advisor'
		},
		{
			key: 'status',
			label: 'Status'
		},
		{
			key: 'testStatus',
			label: 'Test status'
		}
	],
	idKey: 'id',
	actions: [],
	create: [
		{
			operation: 'create',
			label: 'Create product'
		}
	],
	detail: '/products'
} satisfies ComponentProps<typeof ApiList>;
