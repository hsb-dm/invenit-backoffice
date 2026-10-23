<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { request } from '#lib/api/client.js';
	const client = useQueryClient();
	const logout = createMutation(() => ({
		mutationFn: () => request('/api/auth/logout', 'POST'),
		onSettled: async () => {
			client.clear();
			await goto(resolve('/login'));
		}
	}));

	type Item = {
		label: string;
		href:
			| '/'
			| '/clients'
			| '/clients/otp-log'
			| '/kyc-review'
			| '/trading-accounts'
			| '/advisors'
			| '/products'
			| '/subscriptions'
			| '/finance/payments-refunds'
			| '/finance/billing-periods'
			| '/finance/advisor-wallets'
			| '/finance/withdrawals'
			| '/system/users-roles'
			| '/system/menus-dictionary';
		badge?: number;
		section?: boolean;
	};

	const items: Item[] = [
		{ label: 'Dashboard', href: '/' },
		{ label: 'Clients', href: '/clients' },
		{ label: 'OTP log', href: '/clients/otp-log' },
		{ label: 'KYC review', href: '/kyc-review' },
		{ label: 'Trading accounts', href: '/trading-accounts' },
		{ label: 'Advisors', href: '/advisors' },
		{ label: 'Products', href: '/products' },
		{ label: 'Subscriptions', href: '/subscriptions' },
		{ label: 'Finance', href: '/finance/payments-refunds', section: true },
		{ label: 'Payments & refunds', href: '/finance/payments-refunds' },
		{ label: 'Billing periods', href: '/finance/billing-periods' },
		{ label: 'Advisor wallets', href: '/finance/advisor-wallets' },
		{ label: 'Withdrawals', href: '/finance/withdrawals' },
		{ label: 'System', href: '/system/users-roles', section: true },
		{ label: 'Users & roles', href: '/system/users-roles' },
		{ label: 'Menus & dictionary', href: '/system/menus-dictionary' }
	];

	function isActive(item: Item) {
		const pathname = page.url.pathname;
		if (item.label === 'Dashboard') return pathname === '/';
		if (item.label === 'Clients')
			return (
				pathname === '/clients' ||
				(pathname.startsWith('/clients/') && pathname !== '/clients/otp-log')
			);
		if (item.label === 'System') return false;
		if (item.label === 'Finance') return false;
		return pathname === item.href || pathname.startsWith(`${item.href}/`);
	}
</script>

<aside class="sidebar" aria-label="Back-office navigation">
	<a class="brand" href={resolve('/')} aria-label="Invenit dashboard">
		<strong>INvenit</strong>
		<span>BACK OFFICE · UAT</span>
	</a>

	<nav>
		{#each items as item (item.label)}
			<a
				href={resolve(item.href)}
				class:active={isActive(item)}
				class:subitem={!item.section &&
					(item.href.startsWith('/finance/') ||
						item.href.startsWith('/system/') ||
						item.href === '/clients/otp-log')}
				aria-current={isActive(item) ? 'page' : undefined}
			>
				<span>{item.label}</span>
				{#if item.badge}<b class="nav-badge">{item.badge}</b>{/if}
			</a>
		{/each}
	</nav>

	<div class="user-card">
		<strong>{page.data.username || 'Admin'}</strong>
		<button disabled={logout.isPending} onclick={() => logout.mutate()}>Log out</button>
	</div>
</aside>
