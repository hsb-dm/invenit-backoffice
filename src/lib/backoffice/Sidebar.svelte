<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	type Item = { label: string; href: string; badge?: number; section?: boolean };

	const items: Item[] = [
		{ label: 'Dashboard', href: '/' },
		{ label: 'Clients', href: '/clients' },
		{ label: 'KYC review', href: '/kyc-review', badge: 12 },
		{ label: 'Trading accounts', href: '/trading-accounts', badge: 7 },
		{ label: 'Advisors', href: '/advisors', badge: 4 },
		{ label: 'Products', href: '/products' },
		{ label: 'Subscriptions', href: '/subscriptions' },
		{ label: 'Finance', href: '/finance/payments-refunds', badge: 3, section: true },
		{ label: 'Payments & refunds', href: '/finance/payments-refunds' },
		{ label: 'Billing periods', href: '/finance/billing-periods', badge: 2 },
		{ label: 'Advisor wallets', href: '/finance/advisor-wallets' },
		{ label: 'Withdrawals', href: '/finance/withdrawals', badge: 3 },
		{ label: 'IB import', href: '/finance/ib-import' },
		{ label: 'Partnership', href: '/partnership/relationships', section: true },
		{ label: 'System', href: '/system/users-roles', section: true },
		{ label: 'Users & roles', href: '/system/users-roles' },
		{ label: 'Menus & dictionary', href: '/system/menus-dictionary' },
		{ label: 'Config & kill switch', href: '/system/config-kill-switch' },
		{ label: 'Audit log', href: '/system/audit-log' },
		{ label: 'Engine health', href: '/system/engine-health' }
	];

	function isActive(item: Item) {
		const pathname = page.url.pathname;
		if (item.label === 'Dashboard') return pathname === '/';
		if (item.label === 'Partnership') return pathname.startsWith('/partnership');
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
				href={item.href === '/'
					? resolve('/')
					: resolve('/[...path]', { path: item.href.slice(1) })}
				class:active={isActive(item)}
				class:subitem={!item.section &&
					(item.href.startsWith('/finance/') || item.href.startsWith('/system/'))}
				aria-current={isActive(item) ? 'page' : undefined}
			>
				<span>{item.label}</span>
				{#if item.badge}<b class="nav-badge">{item.badge}</b>{/if}
			</a>
		{/each}
	</nav>

	<div class="user-card">
		<strong>Dewi Lestari</strong>
		<span>Ops · role ops_lead · last login 08:41</span>
	</div>
</aside>
