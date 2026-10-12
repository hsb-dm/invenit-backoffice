export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'gray';

export type Kpi = {
	label: string;
	value: string;
	note?: string;
	tone?: Tone;
};

export type Block = {
	title: string;
	subtitle?: string;
	columns?: string[];
	rows?: string[][];
	facts?: [string, string][];
	actions?: string[];
	kind?: 'table' | 'facts' | 'decision' | 'media' | 'chart' | 'tree';
};

export type Screen = {
	id: string;
	path: string;
	title: string;
	subtitle: string;
	nav: string;
	badge?: string;
	actions?: string[];
	filters?: string[];
	tabs?: string[];
	kpis?: Kpi[];
	blocks: Block[];
};

const table = (
	title: string,
	columns: string[],
	rows: string[][],
	subtitle?: string,
	actions?: string[]
): Block => ({ title, columns, rows, subtitle, actions, kind: 'table' });

const facts = (
	title: string,
	rows: [string, string][],
	subtitle?: string,
	actions?: string[]
): Block => ({
	title,
	facts: rows,
	subtitle,
	actions,
	kind: 'facts'
});

export const screens: Screen[] = [
	{
		id: 'dashboard',
		path: '/',
		title: 'Dashboard',
		nav: 'Dashboard',
		subtitle: 'Saturday 20 Sep 2026 · 14:32 WIB · data refreshed 1 min ago',
		actions: ['MARKETPLACE: LIVE'],
		kpis: [
			{
				label: 'New clients today',
				value: '38',
				note: '+12 % vs 7-day avg · 29 via referral',
				tone: 'green'
			},
			{ label: 'KYC approved today', value: '24', note: '21 auto · 3 manual · 12 pending review' },
			{
				label: 'Payments today',
				value: 'Rp 12.450.000',
				note: '83 paid · 5 pending · 9 expired',
				tone: 'green'
			},
			{ label: 'Active subscriptions', value: '1,284', note: '+31 today · 96 paid not active' },
			{
				label: 'Auto-activations due ≤ 3 d',
				value: '17',
				note: 'no verified account yet — reminders sent',
				tone: 'amber'
			},
			{
				label: 'Advisor wallet liabilities',
				value: 'Rp 148.2 M',
				note: '3 withdrawals awaiting approval · Rp 4.2 M'
			}
		],
		blocks: [
			table(
				'Queues needing action',
				['Queue', 'Items', 'Oldest', 'SLA', 'Owner', ''],
				[
					['KYC manual review', '12', '19 h', '1 business day', 'Compliance', 'Open'],
					[
						'Trading account verification (manual brokers)',
						'7',
						'2 d 3 h · breached',
						'1 business day',
						'Ops',
						'Open'
					],
					['Withdrawals to approve', '3 · Rp 4.2 M', '2 d', 'weekly batch Fri', 'Finance', 'Open'],
					['Billing periods on reconcile hold', '2', '1 d', '2 days', 'Finance', 'Open'],
					['Advisor applications', '4', '6 d', 'weekly', 'BD', 'Open'],
					['Payments pending > 2 h', '5', '3 h', 'poll 24 h', 'System', 'View']
				],
				'Sorted by oldest item · SLA from sys_config'
			),
			facts(
				'Integrations health',
				[
					['HSB broker API', 'OK · 210 ms · 1,204 calls'],
					['OTP · WhatsApp / SMS', 'OK · 98.7 % delivered'],
					['KTP OCR + face match', 'OK · avg 6.2 s'],
					['Payment gateway webhooks', 'OK · last webhook 2 min ago'],
					['Licence checks (EA)', '412 / h · 0 revoked responses'],
					['Equity sync job', 'Degraded · last run 26 min ago']
				],
				'Last 15 minutes',
				['Set read-only']
			),
			{
				title: 'Funnel — last 30 days',
				subtitle: 'Signups → KYC approved → first purchase → activated',
				kind: 'chart'
			},
			{
				title: 'Payments per day — Rp M',
				subtitle: 'Paid amount by day, last 14 days',
				kind: 'chart'
			}
		]
	},
	{
		id: 'kyc-list',
		path: '/kyc-review',
		title: 'KYC review',
		nav: 'KYC review',
		badge: '12 open',
		subtitle:
			'Clients with kyc_status = 2 pending_review · SLA 1 business day · permission kyc:approve / kyc:reject',
		filters: ['Reason: All', 'Age: All', 'Assignee: Anyone', 'Attempts: All', 'Sort: Oldest first'],
		blocks: [
			table(
				'',
				[
					'Client ID',
					'Name (OCR)',
					'Phone',
					'Submitted',
					'Reason for review',
					'Attempts',
					'Face score',
					'Age',
					'Assignee',
					''
				],
				[
					[
						'10000498',
						'ANDI PRATAMA',
						'+62 812 ***2211',
						'19 Sep 18:40',
						'OCR failed ×3',
						'3 / 3',
						'—',
						'19 h 52 m',
						'—',
						'Review'
					],
					[
						'10000503',
						'SARI MELATI',
						'+62 813 ***9087',
						'19 Sep 21:05',
						'Face no match',
						'3 / 3',
						'0.62',
						'17 h',
						'Budi S.',
						'Review'
					],
					[
						'10000511',
						'RIZKY H.',
						'+62 857 ***4410',
						'20 Sep 07:12',
						'Name mismatch (OCR vs typed)',
						'1 / 3',
						'0.88',
						'7 h',
						'—',
						'Review'
					],
					[
						'10000512',
						'DEWI ANGGRAINI',
						'+62 811 ***0034',
						'20 Sep 08:30',
						'Under-review flag from engine',
						'1 / 3',
						'0.79',
						'6 h',
						'Budi S.',
						'Review'
					],
					[
						'10000515',
						'BUDI SANTOSO',
						'+62 812 ***7890',
						'20 Sep 09:02',
						'Face no match',
						'3 / 3',
						'0.55',
						'5 h',
						'—',
						'Review'
					],
					[
						'10000519',
						'NUR AISYAH',
						'+62 852 ***1200',
						'20 Sep 10:47',
						'OCR failed ×3',
						'3 / 3',
						'—',
						'3 h',
						'—',
						'Review'
					]
				]
			),
			facts('How this queue works', [
				[
					'Automatic checks',
					'Cases arrive after OCR, selfie, typed-name, or uniqueness checks fail.'
				],
				['Review', 'Compare KTP and OCR fields, then approve, reject, or request a new selfie.'],
				['Routing', 'Duplicate NIK goes to compliance; under-18 is rejected automatically.']
			])
		]
	},
	{
		id: 'kyc-detail',
		path: '/kyc-review/10000503',
		title: 'KYC review · 10000503 · SARI MELATI',
		nav: 'KYC review',
		subtitle:
			'Submitted 19 Sep 21:05 · reason: face no match (best score 0.62 after 3 attempts) · assigned to Budi S.',
		actions: ['← Back to queue', 'Reject…', 'Approve'],
		blocks: [
			{
				title: 'Documents',
				subtitle: 'Signed URLs, 10 min · every view is audited',
				kind: 'media'
			},
			table(
				'Identity fields',
				['Field', 'OCR read', 'Client typed', 'Use'],
				[
					['Full name', 'SARI MELATI', 'Sari Melati', 'match'],
					['NIK', '3174 0512 0896 0001', '3174051208960001', 'match'],
					['Date of birth', '02-04-1996', '2 Apr 1996', 'match'],
					['Address (KTP)', 'JL. MELATI NO. 4, JAKARTA SELATAN', '—', 'info'],
					['Age check', '30 · ≥ 18', '', 'pass'],
					['NIK uniqueness', 'no other client', '', 'pass']
				]
			),
			{
				title: 'Decision',
				subtitle: 'Select the audited result for this review',
				kind: 'decision',
				actions: ['Approve and open next case', 'Approve', 'Cancel']
			},
			table(
				'Client history',
				['When', 'Event', 'Actor'],
				[
					['19 Sep 20:52', 'Signup by Google', 'client'],
					['19 Sep 21:04', 'Face match attempt 3 · 0.62', 'engine'],
					['19 Sep 21:05', 'Assigned for manual review', 'system']
				]
			)
		]
	},
	{
		id: 'clients',
		path: '/clients',
		title: 'Clients',
		nav: 'Clients',
		subtitle: 'All clients · 4,812 · search by Client ID, phone, name, NIK (compliance only)',
		filters: [
			'KYC: All',
			'Status: All',
			'Accounts: Any',
			'Plans: Any',
			'Signed up: Last 30 d',
			'Referral: Any'
		],
		blocks: [
			table(
				'',
				[
					'Client ID',
					'Name',
					'Phone',
					'KYC',
					'Status',
					'Accounts',
					'Active plans',
					'Wallet risk',
					'Signed up',
					'Last login',
					''
				],
				[
					[
						'10000482',
						'Budi Santoso',
						'+62 812 ***7890',
						'Approved · auto',
						'Active',
						'3 (HSB)',
						'2',
						'Moderate',
						'12 Sep 2026',
						'today 13:20',
						'Open'
					],
					[
						'10000503',
						'Sari Melati',
						'+62 813 ***9087',
						'Pending review',
						'Active',
						'0',
						'0',
						'Moderate',
						'19 Sep 2026',
						'today 09:41',
						'Open'
					],
					[
						'10000512',
						'Dewi Anggraini',
						'+62 811 ***0034',
						'Approved · manual',
						'Active',
						'1 (BrokerB)',
						'1',
						'Conservative',
						'18 Sep 2026',
						'yesterday',
						'Open'
					],
					[
						'10000498',
						'Andi Pratama',
						'+62 812 ***2211',
						'Pending review',
						'Active',
						'0',
						'0',
						'—',
						'17 Sep 2026',
						'19 Sep',
						'Open'
					],
					[
						'10000377',
						'Rina Wijaya',
						'+62 857 ***1122',
						'Rejected',
						'Active',
						'0',
						'0',
						'—',
						'02 Sep 2026',
						'05 Sep',
						'Open'
					],
					[
						'10000201',
						'Fajar Nugroho',
						'+62 819 ***6644',
						'Approved · auto',
						'Suspended',
						'2 (HSB)',
						'0',
						'Aggressive',
						'21 Aug 2026',
						'14 Sep',
						'Open'
					]
				]
			),
			facts('Rules on this page', [
				['Privacy', 'Phone is masked except for authorized roles. NIK never appears in lists.'],
				['Open', 'Navigates to client detail; suspension is performed there.'],
				['Export', 'Uses the same masking rules as the screen.']
			])
		]
	},
	{
		id: 'client-detail',
		path: '/clients/10000482',
		title: 'Budi Santoso · 10000482',
		nav: 'Clients',
		subtitle:
			'Client since 12 Sep 2026 · phone +62 812 3456 7890 · email budi@gmail.com · language ID · referred by 10000101',
		actions: ['View KYC', 'Reset password', 'Suspend'],
		tabs: [
			'Overview',
			'KYC',
			'Trading accounts (3)',
			'Subscriptions (2)',
			'Payments (4)',
			'Sessions (2)',
			'Referral',
			'Audit'
		],
		blocks: [
			facts('Identity & KYC', [
				['KYC status', '3 approved · auto'],
				['Full name (KTP)', 'BUDI SANTOSO'],
				['NIK', '3174 **** **** 0482'],
				['Date of birth', '15 Mar 1991 · 35'],
				['Risk profile', 'Moderate · score 42 · valid to 12 Sep 2027'],
				['Documents', 'KTP ✓ · Selfie ✓ · forwarded to HSB 12 Sep']
			]),
			facts('Actions', [
				['Reset KYC attempts', 'client:kyc_reset'],
				['Force KYC review', 'kyc:reject'],
				['Revoke all sessions', 'session:revoke'],
				['View OTP codes', 'otp:view_code'],
				['Suspend client', 'client:suspend']
			]),
			table(
				'Trading accounts',
				['Login', 'Broker', 'Type / rate', 'Equity', 'USD equiv', 'Status', 'Plans on it'],
				[
					['40118', 'HSB', 'IDR · fixed', 'Rp 48.2 M', '$3,041', 'verified', '1'],
					['40119', 'HSB', 'IDR · fixed', 'Rp 24.7 M', '$1,558', 'verified', '0'],
					['40120', 'HSB', 'USD · floating', '$10,120', '$10,120', 'verified', '1']
				]
			),
			facts('Referral', [
				['Code', 'BUDI7K'],
				['lv1 (referrer)', '10000101 Andi Saputra'],
				['lv2', '10000007 Citra Dewi'],
				['Referred by Budi', '3 clients · 2 paid'],
				['Rewards earned', 'Rp 9.000 · 2 vouchers pending']
			])
		]
	},
	{
		id: 'accounts',
		path: '/trading-accounts',
		title: 'Trading accounts',
		nav: 'Trading accounts',
		badge: '7 open · 2 breached',
		subtitle:
			'Manual-broker accounts waiting for verification · verification_status = 0 · SLA 1 business day',
		filters: ['Broker: All', 'Age: All', 'Assignee: Anyone', 'Sort: Oldest first'],
		blocks: [
			table(
				'',
				[
					'Client ID',
					'Name',
					'Broker',
					'Login',
					'Server',
					'Currency / rate',
					'Screenshot',
					'Submitted',
					'Age',
					'Assignee',
					''
				],
				[
					[
						'10000512',
						'Dewi Anggraini',
						'BrokerB',
						'771002',
						'BrokerB-Live',
						'USD · floating',
						'✓',
						'18 Sep 09:10',
						'2 d 5 h',
						'Dewi L.',
						'Review'
					],
					[
						'10000388',
						'Hendra K.',
						'Maxco',
						'5501123',
						'Maxco-Real2',
						'IDR · fixed 14,000',
						'✓',
						'18 Sep 11:40',
						'2 d 2 h',
						'—',
						'Review'
					],
					[
						'10000455',
						'Putri A.',
						'BrokerB',
						'771088',
						'BrokerB-Live',
						'IDR · fixed 10,000',
						'✓',
						'19 Sep 08:02',
						'1 d 6 h',
						'Dewi L.',
						'Review'
					],
					[
						'10000466',
						'Yoga P.',
						'Not listed: “GKInvest”',
						'20031',
						'GKI-Live',
						'IDR · fixed 12,000',
						'✓',
						'19 Sep 15:30',
						'23 h',
						'—',
						'Review'
					],
					[
						'10000470',
						'Maya S.',
						'Maxco',
						'5501201',
						'Maxco-Real2',
						'USD · floating',
						'✗ missing',
						'20 Sep 07:15',
						'7 h',
						'—',
						'Review'
					]
				]
			),
			facts('Rules on this page', [
				['Scope', 'Integrated HSB accounts are verified by API and never appear here.'],
				['Broker', 'Unlisted brokers must be added to the dictionary first.'],
				['SLA', 'Breached means older than one business day.']
			])
		]
	},
	{
		id: 'account-detail',
		path: '/trading-accounts/771002',
		title: 'Verify account · 771002 @ BrokerB · Dewi Anggraini (10000512)',
		nav: 'Trading accounts',
		subtitle:
			'Submitted 18 Sep 09:10 · manual broker · assigned to Dewi L. · SLA breached by 1 d 5 h',
		actions: ['← Back to queue', 'Client profile', 'Request screenshot', 'Reject…', 'Verify'],
		blocks: [
			{
				title: 'Screenshot',
				subtitle: 'MT5 account page: name, login, server, balance',
				kind: 'media'
			},
			table(
				'Form vs KTP',
				['Field', 'Client typed', 'Reference', 'Check'],
				[
					['Broker', 'BrokerB', 'broker id 4 · level 0 · server list ok', 'ok'],
					['Login', '771002', 'unique for broker 4', 'ok'],
					['Server', 'BrokerB-Live', 'in broker.mt5_server list', 'ok'],
					['Account name', 'DEWI ANGGRAINI', 'KTP: DEWI ANGGRAINI', 'match'],
					['Currency / rate', 'USD · floating', 'screenshot shows USD balance', 'ok'],
					['Leverage', '1:500', 'optional', 'info']
				]
			),
			{
				title: 'Decision',
				subtitle: 'Verify, reject, or request a new screenshot',
				kind: 'decision',
				actions: ['Verify and open next', 'Verify', 'Cancel']
			}
		]
	},
	{
		id: 'advisors',
		path: '/advisors',
		title: 'Advisors',
		nav: 'Advisors',
		badge: '4 to review',
		subtitle:
			'Applications from the advisor landing page · BD reviews weekly · permission advisor:approve',
		filters: [
			'Status: Submitted + reviewing',
			'Type: All',
			'Licence check: All',
			'Sort: Oldest first'
		],
		blocks: [
			table(
				'',
				[
					'Ref',
					'Legal name',
					'Type',
					'Licence no',
					'Expiry',
					'Bappebti check',
					'Track record',
					'Proposed product',
					'Submitted',
					'Reviewer',
					''
				],
				[
					[
						'APP-00184',
						'PT Sinar Capital Advisory',
						'PB company',
						'11.PB.201',
						'31 Dec 2026',
						'valid',
						'6 mo live · MT5',
						'Gold Scalper Pro',
						'14 Sep',
						'reviewing · Andi B.',
						'Open'
					],
					[
						'APP-00185',
						'R. Hartono (WPA)',
						'WPA individual',
						'WPA-3391',
						'30 Jun 2027',
						'valid',
						'3 mo demo',
						'EUR Swing · flat',
						'15 Sep',
						'submitted',
						'Open'
					],
					[
						'APP-00186',
						'PT Cakra Futures Advisory',
						'PB company',
						'11.PB.244',
						'15 Nov 2026',
						'expires < 90 d',
						'12 mo live',
						'Cakra Momentum',
						'17 Sep',
						'submitted',
						'Open'
					],
					[
						'APP-00187',
						'PT Nusantara Advisory',
						'PB company',
						'12.PB.234',
						'31 Dec 2027',
						'valid',
						'6 mo live · MT5',
						'Atlas Trend · hybrid',
						'20 Sep',
						'submitted',
						'Open'
					]
				]
			),
			facts('What approval does', [
				['Approve', 'Creates an advisor record, assigns a scheme, and notifies the applicant.'],
				['Products', 'Created after approval; advisor remains draft until first review.'],
				['Reject', 'Requires a dictionary reason; applicant may re-apply after 30 days.']
			])
		]
	},
	{
		id: 'advisor-detail',
		path: '/advisors/7',
		title: 'PT Nusantara Advisory · advisor 7',
		nav: 'Advisors',
		subtitle:
			'PB company · licence 12.PB.234 valid to 31 Dec 2027 · scheme Launch partner 20 · status Active',
		actions: ['Edit', 'Change scheme…', 'Suspend'],
		blocks: [
			table(
				'Products',
				[
					'Product',
					'Delivery',
					'Risk',
					'Pricing (current)',
					'3M return',
					'Max DD',
					'Active subs',
					'Review',
					'Status',
					''
				],
				[
					[
						'Atlas Trend',
						'EA · engine on HSB',
						'High',
						'Rp 150.000 / 30 d + 20 % HWM',
						'+9.15 %',
						'−6.10 %',
						'412',
						'internal',
						'Active',
						'Open'
					],
					[
						'Nusa Steady',
						'EA · engine on HSB',
						'Medium',
						'Rp 120.000 / 30 d',
						'+4.20 %',
						'−2.80 %',
						'298',
						'internal',
						'Active',
						'Open'
					],
					['Nusa Weekly', 'signal', 'Low', 'free', '—', '—', '0', 'unreviewed', 'Draft', 'Open']
				],
				undefined,
				['New product']
			),
			facts(
				'Wallet',
				[
					['Balance (net)', 'Rp 93.960'],
					['Credited this month', 'Rp 393.960'],
					['Withdrawn this month', 'Rp 300.000'],
					['Pending withdrawal', 'none'],
					['Tax type', 'PPh 23 · NPWP · 2 %']
				],
				undefined,
				['Open statement']
			),
			table(
				'Scheme history',
				['Scheme', 'Platform fee', 'IB share / cap', 'From', 'To', 'Changed by'],
				[
					[
						'Launch partner 20',
						'20 %',
						'20 % / cap 100 % of fees',
						'20 Sep 2026',
						'open',
						'Andi B. (BD)'
					],
					['Standard 20', '20 %', '20 % / cap 100 %', '01 Sep 2026', '19 Sep 2026', 'system']
				]
			),
			facts('Payout bank', [
				['Bank', 'BCA'],
				['Account', '1234567890'],
				['Name', 'PT NUSANTARA ADVISORY'],
				['Currency', 'IDR'],
				['NPWP', '01.234.567.8-901.000']
			])
		]
	},
	{
		id: 'products',
		path: '/products',
		title: 'Products',
		nav: 'Products',
		subtitle:
			'Catalogue as clients see it · product + current pricing + latest product_stat · permission product:publish',
		filters: ['Status: All', 'Advisor: All', 'Risk: All', 'Delivery: All', 'Review: All'],
		blocks: [
			table(
				'',
				[
					'Sort',
					'Product',
					'Advisor',
					'Delivery',
					'Risk',
					'Pricing (current)',
					'3M / DD',
					'Trades',
					'Active subs',
					'Review',
					'Status',
					''
				],
				[
					[
						'1',
						'Atlas Trend',
						'Nusantara',
						'EA · engine',
						'High',
						'Rp 150.000 / 30 d + 20 % HWM',
						'+9.15 % / −6.10 %',
						'142',
						'412',
						'internal',
						'Active',
						'Open'
					],
					[
						'2',
						'Nusa Steady',
						'Nusantara',
						'EA · engine',
						'Medium',
						'Rp 120.000 / 30 d',
						'+4.20 % / −2.80 %',
						'88',
						'298',
						'internal',
						'Active',
						'Open'
					],
					[
						'3',
						'Gold Scalper Pro',
						'Sinar Capital',
						'EA · file',
						'High',
						'20 % HWM only',
						'+11.4 % / −9.3 %',
						'610',
						'187',
						'internal',
						'Active',
						'Open'
					],
					[
						'4',
						'EUR Swing',
						'R. Hartono',
						'EA · file',
						'Low',
						'Rp 90.000 / 30 d',
						'+2.1 % / −1.4 %',
						'41',
						'104',
						'internal',
						'Active',
						'Open'
					],
					[
						'5',
						'Momentum ID',
						'Sinar Capital',
						'EA · file',
						'Medium',
						'Rp 100.000 / 45 d',
						'+3.8 % / −4.0 %',
						'77',
						'77',
						'internal',
						'Paused',
						'Open'
					]
				]
			),
			facts('Rules on this page', [
				['Publish', 'Needs a risk level, statistics, pricing, and valid advisor licence.'],
				['Pause', 'Hides Subscribe but leaves active deliveries untouched.'],
				['Price change', 'Creates a new effective pricing row; never changes mid-period.']
			])
		]
	},
	{
		id: 'product-detail',
		path: '/products/12',
		title: 'Atlas Trend · product 12',
		nav: 'Products',
		subtitle:
			'PT Nusantara Advisory · slug atlas-trend · Active since 01 Sep 2026 · 412 active subscriptions',
		actions: ['View as client', 'Pause', 'Unpublish'],
		blocks: [
			facts('Listing', [
				['Name', 'Atlas Trend'],
				['Slug', 'atlas-trend'],
				[
					'Tagline',
					'Trend-following on gold and majors, 4H timeframe, hard stop on every position.'
				],
				['Delivery type', '1 · EA / algorithm'],
				['Instruments', 'XAUUSD, EURUSD'],
				['Min capital (USD)', '500'],
				['Cover image', 'atlas-cover.jpg']
			]),
			facts(
				'Performance test',
				[
					['Status', 'in test · day 65'],
					['Master', 'HSB demo 54001045 · since 1 Aug'],
					['Trades on master', '412 · +9.15 % 3M · DD −6.1 %'],
					['Stats source', '4 engine_charts · daily'],
					['Pass criteria', 'not set (skipped for v1)']
				],
				undefined,
				['Mark test passed', 'Fail · unpublish']
			),
			table(
				'Copy engine · HSB',
				['Rate', 'Master login', 'EA ID', 'Followers', 'Status', 'Last deal', ''],
				[['10.000', '54001045', '66', '118', 'active', 'today 14:02', 'Edit']]
			),
			facts('Compliance', [
				['Risk level', '3 · High'],
				['Review status', '1 · Reviewed internally']
			]),
			facts('Publish checklist', [
				['Advisor licence', '✓ valid to 31 Dec 2027'],
				['Risk level', '✓ set'],
				['Current pricing row', '✓'],
				['Statistic row', '✓']
			])
		]
	},
	{
		id: 'subscriptions',
		path: '/subscriptions',
		title: 'Subscriptions',
		nav: 'Subscriptions',
		subtitle:
			'subscription · all statuses · filters by product, broker, status, period end · permission sub:force_activate',
		filters: [
			'Status: All',
			'Product: All',
			'Broker: All',
			'Delivery: All',
			'Period ends: Any',
			'Sort: Period end'
		],
		kpis: [
			{ label: 'Active', value: '1,284', note: 'engine 1,102 · EA 182' },
			{ label: 'Paid not active', value: '96', note: '17 auto-activate ≤ 3 d', tone: 'amber' },
			{ label: 'In grace period', value: '23', note: 'expire ≤ 3 d if unpaid', tone: 'amber' },
			{ label: 'Suspended', value: '4', note: '2 reconcile · 2 licence', tone: 'red' },
			{ label: 'Expired this month', value: '61', note: 'renewed later: 19' }
		],
		blocks: [
			table(
				'',
				[
					'Subscription',
					'Client',
					'Product',
					'Account',
					'Status',
					'Paid',
					'Activated',
					'Period',
					'Delivery',
					'Last seen',
					''
				],
				[
					[
						'SUB-2201',
						'10000482 Budi S.',
						'Atlas Trend',
						'HSB 40118',
						'Active',
						'19 Sep',
						'25 Sep',
						'25 Sep–24 Oct',
						'engine HSB-CP-88213',
						'2 min ago',
						'Open'
					],
					[
						'SUB-2264',
						'10000482 Budi S.',
						'Nusa Steady',
						'HSB 40120',
						'Paid not active',
						'20 Sep',
						'—',
						'auto 4 Oct',
						'—',
						'—',
						'Open'
					],
					[
						'SUB-2258',
						'10000512 Dewi A.',
						'Gold Scalper Pro',
						'—',
						'Paid not active',
						'18 Sep',
						'—',
						'auto 2 Oct',
						'—',
						'—',
						'Open'
					],
					[
						'SUB-2190',
						'10000101 Andi S.',
						'Atlas Trend',
						'HSB 40077',
						'Active · grace',
						'22 Aug',
						'22 Aug',
						'22 Aug–20 Sep',
						'engine',
						'1 min ago',
						'Open'
					],
					[
						'SUB-2102',
						'10000201 Fajar N.',
						'Gold Scalper Pro',
						'BrokerB 771044',
						'Suspended',
						'10 Aug',
						'11 Aug',
						'11 Aug–9 Sep',
						'EA · revoked',
						'9 Sep',
						'Open'
					]
				]
			)
		]
	},
	{
		id: 'subscription-detail',
		path: '/subscriptions/sub-2201',
		title: 'SUB-2201 · Atlas Trend · Budi Santoso (10000482)',
		nav: 'Subscriptions',
		subtitle:
			'Active · engine on HSB 40118 · paid 19 Sep · activated 25 Sep by client · period 25 Sep–24 Oct',
		actions: ['Client', 'Change account (locked)', 'Suspend…', 'Force activate'],
		blocks: [
			table(
				'Billing periods',
				[
					'Period',
					'Base (IDR)',
					'P&L acct',
					'HWM before → after',
					'Fee acct',
					'FX',
					'Fee (IDR)',
					'Total',
					'Platform 20 %',
					'Advisor gross',
					'Status'
				],
				[
					[
						'25 Sep–24 Oct',
						'150.000',
						'Rp +640 rb (running)',
						'0 → —',
						'—',
						'0 none',
						'—',
						'—',
						'—',
						'—',
						'computed · running'
					],
					[
						'— (activation)',
						'150.000',
						'—',
						'—',
						'—',
						'—',
						'0',
						'150.000',
						'30.000',
						'120.000',
						'paid · flat credited 26 Sep'
					]
				]
			),
			facts('Actions', [
				['Force activate', 'only when paid_inactive'],
				['Suspend with reason', 'pauses delivery, holds billing'],
				['Restore', 'sub:restore'],
				['Revoke licence / unsubscribe engine', 'delivery:revoke'],
				['Waive next period fee', 'period:waive · finance'],
				['Change trading account', 'disabled: delivery exists']
			]),
			facts(
				'Engine',
				[
					['State', 'active'],
					['engine_ref / strategy', 'HSB-CP-88213 · eaId 66 · loginId 40118'],
					['Master · rate group', '54001046 · IDR 10.000'],
					['Multiplier', '100 %'],
					['Open positions', '2 · floating −$120'],
					['Last reconcile', 'today 14:05 · ok'],
					['Last deals pull', 'today 14:00 · 3 new rows']
				],
				undefined,
				['Force reconcile', 'Stop & close positions (admin)']
			),
			facts('Snapshot at purchase', [
				['Model', '3 hybrid'],
				['Flat', 'Rp 150.000'],
				['Fee', '20 % · HWM on'],
				['Period days', '30'],
				['Auto-activate after', '14 days'],
				['Risk ack', 'Moderate vs High · acknowledged']
			])
		]
	},
	{
		id: 'payments',
		path: '/finance/payments-refunds',
		title: 'Payments & refunds',
		nav: 'Payments & refunds',
		subtitle:
			'payment · today · webhook is the source of truth · refunds only while subscription is paid_inactive',
		filters: ['Status: All', 'Method: All', 'Date: Today', 'Amount'],
		kpis: [
			{ label: 'Paid today', value: 'Rp 12.450.000', note: '83 payments' },
			{ label: 'Pending', value: '5', note: '> 2 h without webhook', tone: 'amber' },
			{ label: 'Expired today', value: '9', note: 'no charge' },
			{ label: 'Refunded this month', value: 'Rp 1.050.000', note: '7 · all before activation' },
			{ label: 'Refund requests open', value: '2', note: 'finance to approve', tone: 'amber' }
		],
		blocks: [
			table(
				'',
				[
					'Payment',
					'Client',
					'Subscription',
					'Method',
					'Amount',
					'Status',
					'Created',
					'Paid',
					'Gateway ref',
					'Refund',
					''
				],
				[
					[
						'PAY-88213',
						'10000466 Yoga P.',
						'SUB-2260 Momentum ID',
						'Bank VA',
						'Rp 100.000',
						'Paid',
						'20 Sep 13:02',
						'20 Sep 13:20',
						'va_9a1…',
						'requested · duplicate',
						'Review refund'
					],
					[
						'PAY-88212',
						'10000466 Yoga P.',
						'SUB-2260 Momentum ID',
						'QRIS',
						'Rp 100.000',
						'Paid',
						'20 Sep 12:58',
						'20 Sep 12:59',
						'qr_88c…',
						'—',
						'Open'
					],
					[
						'PAY-88210',
						'10000490 Nia R.',
						'SUB-2262 EUR Swing',
						'E-wallet',
						'Rp 90.000',
						'Pending 3 h',
						'20 Sep 11:40',
						'—',
						'ew_31d…',
						'—',
						'Poll gateway'
					],
					[
						'PAY-88208',
						'10000482 Budi S.',
						'SUB-2264 Nusa Steady',
						'QRIS',
						'Rp 120.000',
						'Paid',
						'20 Sep 10:05',
						'20 Sep 10:06',
						'qr_0f2…',
						'—',
						'Open'
					]
				]
			),
			facts(
				'Refund review · PAY-88213',
				[
					['Subscription status', '1 paid_inactive · refund allowed'],
					['Refund to', 'client_bank_account · BCA 8877 · YOGA PRATAMA'],
					['Name check', 'matches KTP'],
					['Reason', 'Duplicate payment'],
					['Amount', 'Rp 100.000']
				],
				'Two payments for the same subscription within 4 minutes.',
				['Approve refund', 'Reject']
			)
		]
	},
	{
		id: 'billing',
		path: '/finance/billing-periods',
		title: 'Billing periods',
		nav: 'Billing periods',
		badge: '2 on hold',
		subtitle:
			'billing_period · written once by the period-close job · reconcile holds need finance',
		filters: ['Status: On hold', 'Product: All', 'Period end: This week', 'FX source: All'],
		blocks: [
			table(
				'Reconcile holds',
				[
					'Subscription',
					'Client',
					'Product',
					'Period',
					'EA P&L',
					'Broker P&L',
					'Diff',
					'Fee at stake',
					'Held since',
					'Assignee',
					''
				],
				[
					[
						'SUB-2102',
						'10000201 Fajar N.',
						'Gold Scalper Pro',
						'11 Aug–9 Sep',
						'$412.00',
						'$388.50',
						'$23.50 (6 %)',
						'Rp 74.500',
						'10 Sep',
						'Andi P.',
						'Open'
					],
					[
						'SUB-2150',
						'10000388 Hendra K.',
						'EUR Swing',
						'20 Aug–18 Sep',
						'Rp 1.240.000',
						'Rp 1.240.000 (3 trades missing)',
						'3 tickets',
						'Rp 0',
						'19 Sep',
						'—',
						'Open'
					]
				]
			),
			table(
				'Hold · SUB-2102 · what finance sees',
				['Ticket', 'Symbol', 'Lots', 'Close', 'EA profit', 'Broker profit', 'Match'],
				[
					['5512001', 'XAUUSD', '0.10', '2 Sep 14:02', '$82.10', '$82.10', 'ok'],
					['5512040', 'XAUUSD', '0.10', '5 Sep 09:15', '$61.40', '$37.90', 'diff $23.50'],
					['5512088', 'EURUSD', '0.20', '8 Sep 16:40', '$−12.00', '$−12.00', 'ok']
				],
				undefined,
				[
					'Use broker figures and release',
					'Use EA figures and release',
					'Waive performance fee',
					'Keep on hold'
				]
			),
			table(
				'All periods closing this week',
				[
					'Subscription',
					'Product',
					'Period end',
					'Model',
					'P&L acct',
					'Fee acct',
					'FX source',
					'Total IDR',
					'Status'
				],
				[
					['SUB-2201', 'Atlas Trend', '24 Oct', 'hybrid', '—', '—', '0 none', '—', 'running'],
					[
						'SUB-2190',
						'Atlas Trend',
						'20 Sep',
						'hybrid',
						'Rp 420.000',
						'Rp 60.000',
						'15,850',
						'Rp 60.000',
						'pending payment · grace'
					]
				]
			)
		]
	},
	{
		id: 'wallets',
		path: '/finance/advisor-wallets',
		title: 'Advisor wallets',
		nav: 'Advisor wallets',
		subtitle: 'advisor_ledger · append-only · balance = sum of net_idr · tax withheld per credit',
		actions: ['Statements'],
		kpis: [
			{ label: 'Total liabilities', value: 'Rp 148.2 M', note: '12 advisors' },
			{
				label: 'Credited this month',
				value: 'Rp 96.4 M',
				note: 'subscription 71 % · perf 24 % · IB 5 %'
			},
			{ label: 'Tax withheld this month', value: 'Rp 2.1 M', note: 'PPh 23 / 21' },
			{ label: 'Withdrawn this month', value: 'Rp 41.0 M', note: '9 withdrawals' },
			{ label: 'Held', value: 'Rp 3.4 M', note: '1 advisor', tone: 'amber' }
		],
		blocks: [
			table(
				'Balances by advisor',
				[
					'Advisor',
					'Scheme',
					'Balance (net)',
					'Credited MTD',
					'Withdrawn MTD',
					'Pending withdrawal',
					'Tax type',
					'Licence',
					'Status',
					''
				],
				[
					[
						'PT Nusantara Advisory',
						'Launch partner 20',
						'Rp 93.960',
						'Rp 393.960',
						'Rp 300.000',
						'—',
						'PPh 23 · 2 %',
						'valid',
						'Active',
						'Statement'
					],
					[
						'PT Sinar Capital Advisory',
						'Standard 30',
						'Rp 41.2 M',
						'Rp 38.1 M',
						'Rp 20.0 M',
						'Rp 4.2 M',
						'PPh 23 · 2 %',
						'expires 30 Sep',
						'Active',
						'Statement'
					],
					[
						'R. Hartono (WPA)',
						'Standard 30',
						'Rp 6.8 M',
						'Rp 6.8 M',
						'—',
						'—',
						'PPh 21',
						'valid',
						'Active',
						'Statement'
					]
				]
			),
			table(
				'Statement · PT Nusantara Advisory · September 2026',
				['Date', 'Type', 'Source', 'Gross', 'Tax', 'Net', 'Balance after', 'Note'],
				[
					[
						'6 Nov',
						'4 withdrawal',
						'WD-0188',
						'−300.000',
						'—',
						'−300.000',
						'93.960',
						'paid BCA ref 8812'
					],
					[
						'5 Nov',
						'3 ib_bonus',
						'IB report Oct · HSB',
						'150.000',
						'3.000',
						'147.000',
						'393.960',
						'12 lots · cap applied'
					],
					[
						'25 Oct',
						'2 performance_share',
						'SUB-2201',
						'42.000',
						'840',
						'41.160',
						'246.960',
						'fee 60.000 × 70 %'
					]
				]
			)
		]
	},
	{
		id: 'withdrawals',
		path: '/finance/withdrawals',
		title: 'Withdrawals',
		nav: 'Withdrawals',
		badge: '3 to approve · Rp 4.2 M',
		subtitle:
			'advisor_withdrawal · weekly batch (Fri) · four-eyes: approver ≠ advisor account manager',
		filters: ['Status: Requested', 'Advisor: All', 'Requested: This week'],
		blocks: [
			table(
				'',
				[
					'Withdrawal',
					'Advisor',
					'Amount',
					'Balance before',
					'Bank (snapshot)',
					'Requested',
					'Account manager',
					'Licence',
					'Checks',
					'Approver',
					''
				],
				[
					[
						'WD-0191',
						'PT Sinar Capital Advisory',
						'Rp 4.200.000',
						'Rp 41.2 M',
						'BCA 5566 · PT SINAR CAPITAL ADVISORY',
						'18 Sep 10:20',
						'Andi B.',
						'expires 30 Sep',
						'≥ min · ≤ balance · name ok',
						'—',
						'Approve'
					],
					[
						'WD-0192',
						'R. Hartono (WPA)',
						'Rp 1.500.000',
						'Rp 6.8 M',
						'Mandiri 9012 · RUDI HARTONO',
						'19 Sep 08:05',
						'Andi B.',
						'valid',
						'ok',
						'—',
						'Approve'
					],
					[
						'WD-0193',
						'PT Cakra Futures Advisory',
						'Rp 2.000.000',
						'Rp 3.4 M',
						'BNI 3301 · PT CAKRA FUTURES',
						'19 Sep 16:40',
						'Dewi L.',
						'expired',
						'licence expired → held',
						'—',
						'Hold'
					]
				]
			),
			facts(
				'Approve · WD-0191',
				[
					['Approval', 'Sets status approved with approved_by = you.'],
					['Batch', 'Finance exports the bank file on Friday, pays, then marks paid.'],
					['Four-eyes', 'Blocked for the advisor account manager.'],
					['Tax', 'Amounts are net; no further tax at withdrawal.']
				],
				undefined,
				['Approve WD-0191', 'Reject…', 'Open advisor']
			)
		]
	},
	{
		id: 'ib-import',
		path: '/finance/ib-import',
		title: 'IB import',
		nav: 'IB import',
		subtitle:
			'ib_rebate · monthly broker report (CSV) → match to client_trading_account → advisor IB bonus',
		kpis: [
			{ label: 'Batch', value: '#2026-09-HSB', note: 'uploaded 5 Sep · Andi P.' },
			{ label: 'Rows', value: '1,204', note: 'from HSB IB report Aug' },
			{ label: 'Matched', value: '1,171', note: '97 %' },
			{ label: 'Unmatched', value: '33', note: 'no advisor bonus until matched', tone: 'amber' },
			{ label: 'Rebate total', value: '$7,412.50', note: '≈ Rp 117.5 M at 15,850' }
		],
		blocks: [
			table(
				'Unmatched rows · batch #2026-09-HSB',
				['Login', 'Lots', 'Rebate USD', 'Suggested match', 'Confidence', 'Reason', ''],
				[
					['40118', '12.00', '$72.00', '10000482 · 40118', 'high', 'formatting', 'Match'],
					['40120', '3.50', '$21.00', '10000482 · 40120', 'medium', 'typo in report', 'Match'],
					['40991', '8.20', '$49.20', '— not our client', '—', 'referred outside Invenit', 'Ignore']
				]
			),
			table(
				'Bonus preview after matching',
				[
					'Advisor',
					'Clients profitable in Aug',
					'Lots',
					'Rebate IDR',
					'Scheme IB share',
					'Raw bonus',
					'Cap (fees paid)',
					'Bonus to post'
				],
				[
					[
						'PT Nusantara Advisory',
						'61 / 88',
						'412',
						'Rp 38.4 M',
						'20 %',
						'Rp 7.7 M',
						'Rp 61.8 M',
						'Rp 7.7 M'
					],
					[
						'PT Sinar Capital Advisory',
						'40 / 71',
						'610',
						'Rp 55.1 M',
						'20 %',
						'Rp 11.0 M',
						'Rp 9.1 M',
						'Rp 9.1 M (capped)'
					],
					[
						'R. Hartono (WPA)',
						'18 / 30',
						'41',
						'Rp 3.9 M',
						'20 %',
						'Rp 0.8 M',
						'Rp 12.4 M',
						'Rp 0.8 M'
					]
				]
			)
		]
	},
	{
		id: 'relationships',
		path: '/partnership/relationships',
		title: 'Partnership · referral relationships',
		nav: 'Partnership',
		subtitle:
			'referral_upline (lv1–lv7, HSB shape) · referral_code · written once at signup · audited',
		actions: ['Schemes', 'Rewards', 'Export HSB format'],
		filters: ['Level: lv1', 'Has referrer: Any', 'Signed up: Any'],
		blocks: [
			table(
				'Relationship table',
				[
					'Client ID',
					'Name',
					'Code',
					'lv1',
					'lv2',
					'lv3',
					'lv4',
					'lv5',
					'lv6',
					'lv7',
					'Code used',
					'Since',
					''
				],
				[
					[
						'10000503',
						'Sari Melati',
						'SARI2M',
						'10000482',
						'10000101',
						'10000007',
						'0',
						'0',
						'0',
						'0',
						'BUDI7K',
						'19 Sep',
						'Change'
					],
					[
						'10000482',
						'Budi Santoso',
						'BUDI7K',
						'10000101',
						'10000007',
						'0',
						'0',
						'0',
						'0',
						'0',
						'ANDI9Q',
						'12 Sep',
						'Change'
					],
					[
						'10000101',
						'Andi Saputra',
						'ANDI9Q',
						'10000007',
						'0',
						'0',
						'0',
						'0',
						'0',
						'0',
						'CITRA1',
						'03 Aug',
						'Change'
					]
				]
			),
			facts(
				'Change relationship · 10000503 Sari Melati',
				[
					['New lv1', '10000201'],
					['Reason', 'Client request with proof'],
					['Note', 'WhatsApp screenshot attached · ticket CS-4412'],
					['Before', '10000482 Budi → 10000101 Andi → 10000007 Citra'],
					['After', '10000201 Fajar → 10000144 Lina → 0']
				],
				'The only way to edit an upline row · before/after stored in admin_audit',
				['Apply change', 'Cancel']
			)
		]
	},
	{
		id: 'schemes',
		path: '/partnership/schemes-rewards',
		title: 'Referral schemes & rewards',
		nav: 'Partnership',
		subtitle: 'referral_scheme (event, basis, per-level %) · referral_reward (voucher in v1)',
		actions: ['Relationships', 'New scheme'],
		blocks: [
			table(
				'Schemes',
				[
					'Scheme',
					'Event',
					'Basis',
					'lv1',
					'lv2',
					'lv3–lv7',
					'Fixed IDR',
					'Effective',
					'Status',
					'Rewards issued',
					''
				],
				[
					[
						'Launch',
						'2 first_subscription',
						'1 platform_fee',
						'10 %',
						'0',
						'0',
						'—',
						'01 Sep 2026 → open',
						'Active',
						'214 · Rp 963.000',
						'Edit'
					],
					[
						'Renewal thanks',
						'3 renewal',
						'1 platform_fee',
						'5 %',
						'0',
						'0',
						'—',
						'01 Oct 2026 → open',
						'Scheduled',
						'0',
						'Edit'
					],
					[
						'Beta signup',
						'1 signup',
						'fixed',
						'—',
						'—',
						'—',
						'Rp 10.000',
						'01 Jul → 31 Aug 2026',
						'Archived',
						'88 · Rp 880.000',
						'View'
					]
				]
			),
			table(
				'Rewards · this month',
				[
					'Reward',
					'Referrer',
					'Referred client',
					'Scheme',
					'Source payment',
					'Amount',
					'Status',
					'Created',
					''
				],
				[
					[
						'RW-1201',
						'10000482 Budi S.',
						'10000503 Sari M.',
						'Launch',
						'PAY-88231 · Rp 150.000',
						'Rp 4.500',
						'pending · next renewal 24 Oct',
						'21 Sep',
						'Void'
					],
					[
						'RW-1198',
						'10000101 Andi S.',
						'10000482 Budi S.',
						'Launch',
						'PAY-88201 · Rp 150.000',
						'Rp 4.500',
						'applied · PAY-88240',
						'19 Sep',
						'Open'
					],
					[
						'RW-1190',
						'10000007 Citra D.',
						'10000101 Andi S.',
						'Launch',
						'PAY-88102',
						'Rp 4.500',
						'voided · refund',
						'12 Sep',
						'Open'
					]
				]
			)
		]
	},
	{
		id: 'users',
		path: '/system/users-roles',
		title: 'Users & roles',
		nav: 'Users & roles',
		subtitle:
			'sys_user · sys_role · sys_user_role · back-office login is separate from client login',
		blocks: [
			table(
				'Users',
				['User', 'Name', 'Roles', 'Status', 'Last login', '2FA', ''],
				[
					['dewi.l', 'Dewi Lestari', 'ops_lead', 'Active', 'today 08:41', '✓', 'Edit'],
					['budi.s', 'Budi Setiawan', 'compliance', 'Active', 'today 09:02', '✓', 'Edit'],
					['andi.p', 'Andi Prasetyo', 'finance', 'Active', 'today 08:55', '✓', 'Edit'],
					['andi.b', 'Andi Budiman', 'bd', 'Active', '19 Sep', '✓', 'Edit'],
					['sari.m', 'Sari Mulyani', 'cs', 'Active', 'today 11:50', '✓', 'Edit'],
					['sys.admin', 'System admin', 'admin', 'Active', '18 Sep', '✓', 'Edit']
				]
			),
			facts('Roles → what they can do', [
				['admin', 'everything including config, kill switch, audit'],
				['ops_lead', 'clients, accounts, subscriptions, OTP'],
				['compliance', 'KYC review, risk, referral relationships'],
				['finance', 'payments, refunds, wallets, withdrawals, IB import'],
				['bd', 'advisors, schemes, products'],
				['cs', 'read access; no KTP or money buttons']
			]),
			facts('Rules', [
				['Roles', 'A user can hold several roles; permissions are the union.'],
				['Four-eyes', 'Withdrawal and KYC approval cannot be performed by the record owner.'],
				['Sessions', '8 h · 2FA mandatory · IP logged.']
			])
		]
	},
	{
		id: 'menus',
		path: '/system/menus-dictionary',
		title: 'Menus & dictionary',
		nav: 'Menus & dictionary',
		subtitle: 'sys_menu (tree with button nodes) · sys_dict / sys_dict_item · copied from SmartCRM',
		blocks: [
			{ title: 'Menu tree', subtitle: 'type: menu · button (permission key)', kind: 'tree' },
			table(
				'Dictionaries',
				['Dictionary', 'Items', 'Used by', 'Last change'],
				[
					['client_kyc_status', '5', 'client', '—'],
					['subscription_status', '6', 'subscription, Status Pill', '—'],
					['payment_method', '4', 'payment, checkout', '—'],
					['kyc_reject_reason', '5', 'KYC review', '19 Sep · Budi S.'],
					['account_reject_reason', '5', 'Account verification', '—'],
					['refund_reason', '4', 'Finance', '—'],
					['occupation', '12', 'risk questionnaire Q7', '—'],
					['bank_code', '40', 'client_bank_account, advisor', '—'],
					['broker', '5', 'broker table mirror', '20 Sep · Dewi L.']
				]
			)
		]
	},
	{
		id: 'config',
		path: '/system/config-kill-switch',
		title: 'Config & kill switch',
		nav: 'Config & kill switch',
		subtitle: 'sys_config · single row · effective immediately · every change writes admin_audit',
		actions: ['Reset', 'Save changes'],
		blocks: [
			facts('Kill switch · marketplace_status', [
				['1 · Live', 'purchases, activations, deliveries all on'],
				['2 · Read-only', 'no new purchases or activations; deliveries continue'],
				['3 · Hidden', 'maintenance page for clients; back office keeps working']
			]),
			facts('Subscription clocks', [
				['period_days', '30'],
				['auto_activate_after_days', '14'],
				['grace_days', '3'],
				['renewal_reminder_days', '3'],
				['kyc_max_attempts', '3'],
				['face_match_threshold', '0.80']
			]),
			facts('Money', [
				['fx_usd_idr', '15,850'],
				['fx_as_of', '18 Sep 2026'],
				['default_platform_fee_pct', '30'],
				['tax_pph23_pct', '2'],
				['min_withdrawal_idr', '500,000'],
				['withdrawal_cadence', 'weekly · Fri']
			]),
			table(
				'Recent config changes',
				['When', 'Key', 'Before', 'After', 'By', 'Reason'],
				[
					['18 Sep 09:00', 'fx_usd_idr', '15,800', '15,850', 'Andi P. (finance)', 'weekly rate'],
					[
						'12 Sep 15:20',
						'face_match_threshold',
						'0.85',
						'0.80',
						'Budi S. (compliance)',
						'manual review volume'
					],
					[
						'01 Sep 10:00',
						'marketplace_status',
						'3 hidden',
						'1 live',
						'sys.admin + Dewi L.',
						'go-live'
					]
				]
			)
		]
	},
	{
		id: 'audit',
		path: '/system/audit-log',
		title: 'Audit log',
		nav: 'Audit log',
		subtitle:
			'admin_audit · every back-office write and every view of KTP images or OTP codes · read-only',
		filters: ['Entity: All', 'Action: All', 'Admin: All', 'Date: Today'],
		blocks: [
			table(
				'',
				['When', 'Admin', 'Action', 'Entity', 'Entity id', 'Before → after', 'IP', ''],
				[
					[
						'14:29:10',
						'Budi S. (compliance)',
						'kyc:approve',
						'client_identity',
						'10000512',
						'kyc_status 2 → 3 · approval_type — → 2',
						'10.0.4.12',
						'Diff'
					],
					[
						'14:21:44',
						'Dewi L. (ops)',
						'account:verify',
						'client_trading_account',
						'771002@BrokerB',
						'verification_status 0 → 1',
						'10.0.4.9',
						'Diff'
					],
					[
						'13:58:02',
						'Andi P. (finance)',
						'withdrawal:approve',
						'advisor_withdrawal',
						'WD-0188',
						'status 0 → 1 · approved_by — → andi.p',
						'10.0.4.20',
						'Diff'
					],
					[
						'13:40:31',
						'Andi P. (finance)',
						'payment:refund',
						'payment',
						'PAY-88213',
						'status 1 → 4 · refund_reason — → duplicate',
						'10.0.4.20',
						'Diff'
					],
					[
						'12:05:00',
						'job',
						'sub:auto_activate',
						'subscription',
						'6 rows',
						'status 1 → 2 · activation_type 2',
						'—',
						'Rows'
					],
					[
						'11:52:17',
						'Sari M. (CS)',
						'otp:view_code',
						'otp',
						'+62 812 ***7890',
						'viewed (no change)',
						'10.0.4.31',
						'Detail'
					]
				]
			)
		]
	},
	{
		id: 'engine',
		path: '/system/engine-health',
		title: 'Engine health',
		nav: 'Engine health',
		subtitle:
			'HSB copy gateway · one master per product · reconcile every 5 min · deals pull hourly',
		actions: ['Run reconcile'],
		kpis: [
			{ label: 'Masters', value: '6', note: '4 products · 1 master in test' },
			{ label: 'Followers (active)', value: '1,284', note: '+38 today' },
			{ label: 'Reconcile failures', value: '2', note: 'last 24 h', tone: 'red' },
			{ label: 'Removed by engine', value: '3', note: 'last 24 h', tone: 'red' },
			{ label: 'Deals pull', value: '14:00', note: 'ok · 2,113 rows today', tone: 'green' },
			{ label: 'Gateway', value: '212 ms', note: 'p95 · 0 errors', tone: 'green' }
		],
		blocks: [
			table(
				'Master per product',
				[
					'Product',
					'Source',
					'Rate',
					'Master login',
					'EA ID',
					'Followers',
					'Equity',
					'Last deal',
					'Status',
					''
				],
				[
					[
						'Atlas Trend',
						'EA',
						'10.000',
						'54001045',
						'66',
						'118',
						'$10,240',
						'14:02',
						'active',
						'Open'
					],
					[
						'Nusa Steady',
						'EA',
						'10.000',
						'54001050',
						'67',
						'412',
						'$9,870',
						'13:55',
						'active',
						'Open'
					],
					[
						'Nusa Weekly',
						'Human account',
						'10.000',
						'54001060',
						'71',
						'0',
						'$5,000',
						'2 Oct',
						'in test · day 12',
						'Open'
					]
				]
			),
			table(
				'Removed by the engine · last 24 h',
				[
					'Time',
					'Subscription',
					'Client',
					'Product',
					'Login',
					'End reason',
					'Closed',
					'Realised P&L',
					'Client notified',
					''
				],
				[
					[
						'14:05',
						'SUB-2240',
						'10000519',
						'Atlas Trend',
						'40231',
						'3 engine_stop_loss',
						'3',
						'−$212',
						'yes',
						'Open'
					],
					[
						'11:20',
						'SUB-2188',
						'10000433',
						'Nusa Steady',
						'40199',
						'3 engine_stop_loss',
						'1',
						'−$44',
						'yes',
						'Open'
					],
					[
						'09:02',
						'SUB-2301',
						'10000602',
						'Atlas Trend',
						'40260',
						'4 engine_removed',
						'0',
						'$0',
						'pending',
						'Investigate'
					]
				]
			),
			table(
				'Reconcile failures · gateway errors',
				['Time', 'Job', 'Error', 'Retries', 'Action'],
				[['14:05', 'engine_reconcile', 'timeout contacting HSB', '3 · next 14:10', 'Retry now']]
			)
		]
	}
];

export const screenByPath = new Map(screens.map((screen) => [screen.path, screen]));
