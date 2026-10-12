<script lang="ts">
	import type { Block, Screen, Tone } from './screens';
	import { resolve } from '$app/paths';

	let { screen }: { screen: Screen } = $props();
	let search = $state('');
	let activeTab = $state('Overview');
	let selectedFilter = $state('');
	let decision = $state('Approve');
	let notice = $state('');
	let marketplace = $state('1 · Live');

	const bars = [42, 28, 58, 35, 70, 62, 48, 79, 54, 67, 85, 61, 49, 74, 88, 73, 65, 71];

	function tone(text: string): Tone | undefined {
		const value = text.toLowerCase();
		if (/active|approved|paid|valid|match|pass|ok|yes|live|verified|high/.test(value))
			return 'green';
		if (/pending|review|hold|grace|scheduled|medium|test|requested|expire/.test(value))
			return 'amber';
		if (/reject|suspend|fail|breach|missing|diff|expired|stop|removed/.test(value)) return 'red';
		if (/computed|refunded|running/.test(value)) return 'blue';
		if (/draft|archived|unreviewed|info|disabled/.test(value)) return 'gray';
	}

	function isAction(value: string, index: number, row: string[]) {
		return (
			index === row.length - 1 &&
			/^(Open|Review|View|Edit|Statement|Approve|Hold|Match|Ignore|Change|Void|Diff|Rows|Detail|Poll gateway|Investigate|Retry now)$/.test(
				value
			)
		);
	}

	function actionHref(label: string) {
		if (!/Open|Review/.test(label)) return undefined;
		if (screen.id === 'kyc-list') return '/kyc-review/10000503';
		if (screen.id === 'clients') return '/clients/10000482';
		if (screen.id === 'accounts') return '/trading-accounts/771002';
		if (screen.id === 'advisors') return '/advisors/7';
		if (screen.id === 'products') return '/products/12';
		if (screen.id === 'subscriptions') return '/subscriptions/sub-2201';
	}

	function visibleRows(block: Block) {
		if (!block.rows || !search.trim()) return block.rows ?? [];
		const query = search.toLowerCase();
		return block.rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(query)));
	}

	function act(label: string) {
		notice = `${label} updated locally`;
	}
</script>

<svelte:head><title>{screen.title} · Invenit</title></svelte:head>

<div class="screen screen-{screen.id}">
	<header class="page-header">
		<div>
			<h1>{screen.title}</h1>
			<p>{screen.subtitle}</p>
		</div>
		<div class="header-actions">
			{#if screen.badge}<span class="pill amber">{screen.badge}</span>{/if}
			{#each screen.actions ?? [] as action (action)}
				{#if action === 'Schemes'}
					<a class="button" href={resolve('/[...path]', { path: 'partnership/schemes-rewards' })}
						>{action}</a
					>
				{:else if action === 'Relationships'}
					<a class="button" href={resolve('/[...path]', { path: 'partnership/relationships' })}
						>{action}</a
					>
				{:else}
					<button
						class:danger={/Suspend|Unpublish|Fail/.test(action)}
						class:success={action.includes('LIVE')}
						onclick={() => act(action)}>{action}</button
					>
				{/if}
			{/each}
		</div>
	</header>

	{#if notice}
		<div class="notice" role="status">
			{notice}<button aria-label="Dismiss" onclick={() => (notice = '')}>×</button>
		</div>
	{/if}

	{#if screen.tabs}
		<div class="tabs" role="tablist">
			{#each screen.tabs as tab (tab)}
				<button
					role="tab"
					aria-selected={activeTab === tab}
					class:active={activeTab === tab}
					onclick={() => (activeTab = tab)}>{tab}</button
				>
			{/each}
		</div>
	{/if}

	{#if screen.kpis}
		<section class="kpi-grid" aria-label="Summary">
			{#each screen.kpis as kpi (kpi.label)}
				<article class="kpi">
					<span>{kpi.label}</span>
					<strong class={kpi.tone ?? ''}>{kpi.value}</strong>
					{#if kpi.note}<small class={kpi.tone ?? ''}>{kpi.note}</small>{/if}
				</article>
			{/each}
		</section>
	{/if}

	{#if screen.filters}
		<div class="filters">
			{#each screen.filters as filter (filter)}
				<button
					class:active={selectedFilter === filter}
					onclick={() => (selectedFilter = selectedFilter === filter ? '' : filter)}
					>{filter}<span>⌄</span></button
				>
			{/each}
			<label class="search"
				><span class="sr-only">Search</span><input
					bind:value={search}
					placeholder="Search {screen.nav.toLowerCase()}"
				/></label
			>
		</div>
	{/if}

	<div class="content-grid">
		{#each screen.blocks as block (block.title)}
			<section class="block kind-{block.kind ?? 'table'}">
				{#if block.title}<h2>{block.title}</h2>{/if}
				{#if block.subtitle}<p class="block-subtitle">{block.subtitle}</p>{/if}

				{#if block.kind === 'media'}
					<div class="media-grid">
						<div>image · 1 · id_card</div>
						<div>image · 2 · selfie</div>
					</div>
					<div class="attempts">
						<span>Attempt 1 · face score 0.58</span><span>Attempt 2 · face score 0.61</span><span
							>Attempt 3 · face score 0.62</span
						>
					</div>
				{:else if block.kind === 'decision'}
					<div class="decision">
						{#each ['Approve', 'Reject with reason', 'Request new document'] as option (option)}
							<label
								><input type="radio" name={screen.id} value={option} bind:group={decision} />
								<span><strong>{option}</strong> — audited decision and client notification</span
								></label
							>
						{/each}
						<textarea aria-label="Reviewer note">Reviewer note saved to admin_audit.</textarea>
					</div>
				{:else if block.kind === 'chart'}
					<div class="chart" aria-label={block.title}>
						{#each bars as bar, i (`${i}-${bar}`)}<i
								style:height={`${bar}%`}
								class:alt={i % 4 === 0}
							></i>{/each}
					</div>
				{:else if block.kind === 'tree'}
					<div class="menu-tree">
						{#each ['Dashboard', 'Clients', '  client:view_ktp', '  otp:view_code', 'KYC review', '  kyc:approve', '  kyc:reject', 'Trading accounts', '  account:verify', 'Subscriptions', '  sub:force_activate', 'Finance', '  payment:refund', '  withdrawal:approve', '  ib:import'] as item (item)}
							<div class:child={item.startsWith('  ')}>
								{item.trim()} <span>{item.startsWith('  ') ? 'button' : 'menu'}</span>
							</div>
						{/each}
					</div>
				{:else if block.facts}
					<div class="facts-list">
						{#each block.facts as [key, value] (key)}
							{#if screen.id === 'config' && key.includes('·')}
								<button
									class="fact-row choice"
									class:selected={marketplace === key}
									onclick={() => (marketplace = key)}
								>
									<span>{key}</span><strong>{value}</strong>
								</button>
							{:else}
								<div class="fact-row"><span>{key}</span><strong>{value}</strong></div>
							{/if}
						{/each}
					</div>
				{:else if block.columns && block.rows}
					<div class="table-wrap">
						<table>
							<thead
								><tr
									>{#each block.columns as column (column)}<th>{column}</th>{/each}</tr
								></thead
							>
							<tbody>
								{#each visibleRows(block) as row (row[0])}
									<tr
										>{#each row as cell, index (`${index}-${cell}`)}<td
												>{#if isAction(cell, index, row)}{@const href =
														actionHref(cell)}{#if href}<a
															class="button small primary"
															href={resolve('/[...path]', { path: href.slice(1) })}>{cell}</a
														>{:else}<button
															class="small"
															class:primary={/Review|Approve|Match/.test(cell)}
															onclick={() => act(cell)}>{cell}</button
														>{/if}{:else if tone(cell)}<span class="pill {tone(cell)}">{cell}</span
													>{:else}{cell}{/if}</td
											>{/each}</tr
									>
								{:else}<tr
										><td colspan={block.columns.length} class="empty">No matching records</td></tr
									>{/each}
							</tbody>
						</table>
					</div>
				{/if}

				{#if block.actions}
					<div class="block-actions">
						{#each block.actions as action (action)}<button
								class:primary={action === block.actions[0]}
								class:danger={/Stop|Fail/.test(action)}
								onclick={() => act(action)}>{action}</button
							>{/each}
					</div>
				{/if}
			</section>
		{/each}
	</div>

	{#if screen.blocks.some((block) => block.rows && block.rows.length > 4)}
		<nav class="pagination" aria-label="Pagination">
			<button>‹</button><button class="active">1</button><button>2</button><button>3</button><button
				>›</button
			>
		</nav>
	{/if}
</div>
