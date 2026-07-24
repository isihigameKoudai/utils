import { MY_CATALOG_ID } from '../catalog';

const SURFACE_ID = 'generative-dashboard';

const p1_createSurface = {
	version: 'v0.9' as const,
	createSurface: { surfaceId: SURFACE_ID, catalogId: MY_CATALOG_ID },
};

const p2_skeleton = {
	version: 'v0.9' as const,
	updateComponents: {
		surfaceId: SURFACE_ID,
		components: [
			{
				id: 'root',
				component: 'Column',
				children: [
					'alert-area',
					'page-header',
					'kpi-row',
					'chart-row',
					'detail-row',
					'bottom-row',
				],
				align: 'stretch',
			},
			{ id: 'alert-area', component: 'Text', text: '', variant: 'caption' },
			{
				id: 'page-header',
				component: 'Row',
				children: ['page-title', 'page-subtitle'],
				align: 'center',
			},
			{
				id: 'page-title',
				component: 'Text',
				text: '📊 Sales Operations Dashboard',
				variant: 'h1',
			},
			{
				id: 'page-subtitle',
				component: 'Text',
				text: 'Live · Jul 2026',
				variant: 'caption',
			},
			{
				id: 'kpi-row',
				component: 'Row',
				children: ['kpi-s1', 'kpi-s2', 'kpi-s3', 'kpi-s4'],
			},
			{
				id: 'kpi-s1',
				component: 'Text',
				text: 'Loading…',
				variant: 'caption',
				weight: 1,
			},
			{
				id: 'kpi-s2',
				component: 'Text',
				text: '…',
				variant: 'caption',
				weight: 1,
			},
			{
				id: 'kpi-s3',
				component: 'Text',
				text: '…',
				variant: 'caption',
				weight: 1,
			},
			{
				id: 'kpi-s4',
				component: 'Text',
				text: '…',
				variant: 'caption',
				weight: 1,
			},
			{
				id: 'chart-row',
				component: 'Row',
				children: ['chart-loading', 'status-loading'],
			},
			{
				id: 'chart-loading',
				component: 'Text',
				text: 'Loading chart…',
				variant: 'caption',
				weight: 2,
			},
			{
				id: 'status-loading',
				component: 'Text',
				text: 'Loading status…',
				variant: 'caption',
				weight: 1,
			},
			{
				id: 'detail-row',
				component: 'Row',
				children: ['sales-loading', 'products-loading'],
			},
			{
				id: 'sales-loading',
				component: 'Text',
				text: 'Loading sales…',
				variant: 'caption',
				weight: 2,
			},
			{
				id: 'products-loading',
				component: 'Text',
				text: 'Loading products…',
				variant: 'caption',
				weight: 1,
			},
			{ id: 'bottom-row', component: 'Row', children: ['activity-loading'] },
			{
				id: 'activity-loading',
				component: 'Text',
				text: 'Loading activity…',
				variant: 'caption',
			},
		],
	},
};

const p3_alert = {
	version: 'v0.9' as const,
	updateComponents: {
		surfaceId: SURFACE_ID,
		components: [
			{
				id: 'alert-area',
				component: 'AlertBanner',
				message: { path: '/alert/message' },
				variant: { path: '/alert/variant' },
			},
		],
	},
};

const p4_kpis = {
	version: 'v0.9' as const,
	updateComponents: {
		surfaceId: SURFACE_ID,
		components: [
			{
				id: 'kpi-row',
				component: 'Row',
				children: ['kpi-revenue', 'kpi-orders', 'kpi-cac', 'kpi-churn'],
			},
			{
				id: 'kpi-revenue',
				component: 'KpiCard',
				title: { path: '/revenue/label' },
				value: {
					call: 'formatCurrency',
					args: { value: { path: '/revenue/value' }, currency: 'USD' },
					returnType: 'string',
				},
				trend: {
					call: 'formatString',
					args: {
						// biome-ignore lint/suspicious/noTemplateCurlyInString: A2UI formatString uses ${/path} as its own expression syntax
						value: '+${/revenue/changePercent}% MoM',
					},
					returnType: 'string',
				},
				trendPositive: true,
				weight: 1,
			},
			{
				id: 'kpi-orders',
				component: 'KpiCard',
				title: { path: '/orders/label' },
				value: {
					call: 'formatNumber',
					args: { value: { path: '/orders/value' } },
					returnType: 'string',
				},
				trend: {
					call: 'formatString',
					args: {
						// biome-ignore lint/suspicious/noTemplateCurlyInString: A2UI formatString uses ${/path} as its own expression syntax
						value: '+${/orders/changePercent}% MoM',
					},
					returnType: 'string',
				},
				trendPositive: true,
				weight: 1,
			},
			{
				id: 'kpi-cac',
				component: 'KpiCard',
				title: { path: '/cac/label' },
				value: {
					call: 'formatCurrency',
					args: { value: { path: '/cac/value' }, currency: 'USD' },
					returnType: 'string',
				},
				trend: {
					call: 'formatString',
					args: {
						// biome-ignore lint/suspicious/noTemplateCurlyInString: A2UI formatString uses ${/path} as its own expression syntax
						value: '${/cac/changePercent}% MoM',
					},
					returnType: 'string',
				},
				trendPositive: false,
				weight: 1,
			},
			{
				id: 'kpi-churn',
				component: 'KpiCard',
				title: { path: '/churn/label' },
				value: {
					call: 'formatString',
					args: {
						// biome-ignore lint/suspicious/noTemplateCurlyInString: A2UI formatString uses ${/path} as its own expression syntax
						value: '${/churn/value}%',
					},
					returnType: 'string',
				},
				trend: {
					call: 'formatString',
					args: {
						// biome-ignore lint/suspicious/noTemplateCurlyInString: A2UI formatString uses ${/path} as its own expression syntax
						value: '${/churn/changePercent}% MoM',
					},
					returnType: 'string',
				},
				trendPositive: false,
				weight: 1,
			},
		],
	},
};

const p5_chartsAndStatus = {
	version: 'v0.9' as const,
	updateComponents: {
		surfaceId: SURFACE_ID,
		components: [
			{
				id: 'chart-row',
				component: 'Row',
				children: ['weekly-chart-card', 'system-status-card'],
				align: 'stretch',
			},
			{
				id: 'weekly-chart-card',
				component: 'Card',
				child: 'weekly-chart',
				weight: 2,
			},
			{
				id: 'weekly-chart',
				component: 'MiniBarChart',
				title: 'Weekly Revenue (USD)',
				values: { path: '/weeklyRevenue' },
				labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				color: '#6366f1',
				unit: 'USD',
			},
			{
				id: 'system-status-card',
				component: 'Card',
				child: 'system-status-col',
				weight: 1,
			},
			{
				id: 'system-status-col',
				component: 'Column',
				children: ['system-status-header', 'status-list'],
			},
			{
				id: 'system-status-header',
				component: 'SectionHeader',
				title: 'System Status',
				subtitle: 'All services',
				accentColor: '#6366f1',
			},
			{
				id: 'status-list',
				component: 'List',
				children: { path: '/services', componentId: 'status-badge-template' },
			},
			{
				id: 'status-badge-template',
				component: 'StatusBadge',
				label: { path: 'name' },
				status: { path: 'status' },
				description: { path: 'latency' },
			},
		],
	},
};

const p6_salesAndProducts = {
	version: 'v0.9' as const,
	updateComponents: {
		surfaceId: SURFACE_ID,
		components: [
			{
				id: 'detail-row',
				component: 'Row',
				children: ['sales-card', 'products-card'],
				align: 'stretch',
			},
			{ id: 'sales-card', component: 'Card', child: 'sales-col', weight: 2 },
			{
				id: 'sales-col',
				component: 'Column',
				children: ['sales-header', 'sales-list'],
			},
			{
				id: 'sales-header',
				component: 'SectionHeader',
				title: 'Recent Transactions',
				subtitle: 'Last 5 deals closed',
				accentColor: '#10b981',
			},
			{
				id: 'sales-list',
				component: 'List',
				children: { path: '/sales', componentId: 'sale-row-template' },
			},
			{
				id: 'sale-row-template',
				component: 'SalesRow',
				customer: { path: 'customer' },
				amount: {
					call: 'formatCurrency',
					args: { value: { path: 'amount' }, currency: 'USD' },
					returnType: 'string',
				},
			},
			{
				id: 'products-card',
				component: 'Card',
				child: 'products-col',
				weight: 1,
			},
			{
				id: 'products-col',
				component: 'Column',
				children: ['products-header', 'products-list'],
			},
			{
				id: 'products-header',
				component: 'SectionHeader',
				title: 'Top Plans',
				subtitle: 'By units sold',
				accentColor: '#f59e0b',
			},
			{
				id: 'products-list',
				component: 'List',
				children: { path: '/products', componentId: 'product-row-template' },
			},
			{
				id: 'product-row-template',
				component: 'ProductRow',
				name: { path: 'name' },
				units: {
					call: 'formatNumber',
					args: { value: { path: 'units' } },
					returnType: 'string',
				},
				rank: { path: 'rank' },
				maxUnits: 1500,
			},
		],
	},
};

const p7_activity = {
	version: 'v0.9' as const,
	updateComponents: {
		surfaceId: SURFACE_ID,
		components: [
			{ id: 'bottom-row', component: 'Row', children: ['activity-card'] },
			{ id: 'activity-card', component: 'Card', child: 'activity-col' },
			{
				id: 'activity-col',
				component: 'Column',
				children: ['activity-header', 'activity-list'],
			},
			{
				id: 'activity-header',
				component: 'SectionHeader',
				title: 'Live Activity Feed',
				subtitle: 'Real-time events',
				accentColor: '#8b5cf6',
			},
			{
				id: 'activity-list',
				component: 'List',
				children: { path: '/activity', componentId: 'activity-item-template' },
			},
			{
				id: 'activity-item-template',
				component: 'ActivityItem',
				message: { path: 'message' },
				time: { path: 'time' },
				type: { path: 'type' },
			},
		],
	},
};

const p8_data = {
	version: 'v0.9' as const,
	updateDataModel: {
		surfaceId: SURFACE_ID,
		value: {
			alert: {
				message:
					'🎉 July revenue target achieved — 114% of goal. Streak: 3 months.',
				variant: 'success',
			},
			revenue: {
				label: 'Monthly Revenue',
				value: 124_580,
				changePercent: 14.2,
			},
			orders: { label: 'New Orders', value: 3_842, changePercent: 8.7 },
			cac: { label: 'Customer Acq. Cost', value: 38, changePercent: -4.1 },
			churn: { label: 'Churn Rate', value: 1.8, changePercent: -0.3 },
			weeklyRevenue: [18_200, 21_400, 19_800, 24_100, 22_600, 15_300, 28_900],
			services: [
				{ name: 'API Gateway', status: 'healthy', latency: '12ms' },
				{ name: 'Auth Service', status: 'healthy', latency: '8ms' },
				{ name: 'Payment Processor', status: 'warning', latency: '340ms' },
				{ name: 'Analytics Pipeline', status: 'healthy', latency: '55ms' },
				{ name: 'Email Service', status: 'inactive', latency: '—' },
			],
			sales: [
				{ customer: 'Acme Corp', amount: 4_200 },
				{ customer: 'Globex Inc', amount: 2_750 },
				{ customer: 'Initech', amount: 1_980 },
				{ customer: 'Umbrella Ltd', amount: 3_420 },
				{ customer: 'Hooli', amount: 5_100 },
			],
			products: [
				{ name: 'Pro Plan', units: 1_240, rank: 1 },
				{ name: 'Starter Plan', units: 890, rank: 2 },
				{ name: 'Add-ons', units: 657, rank: 3 },
				{ name: 'Enterprise', units: 312, rank: 4 },
			],
			activity: [
				{
					message: 'Hooli signed Enterprise contract — $61,200/yr',
					time: '2 min ago',
					type: 'sale',
				},
				{
					message: 'New signup: sarah@techcorp.io (Pro Plan)',
					time: '5 min ago',
					type: 'signup',
				},
				{
					message: 'Payment processor latency spike detected (340ms)',
					time: '8 min ago',
					type: 'alert',
				},
				{
					message: 'v2.4.1 deployed to production — all checks passed',
					time: '14 min ago',
					type: 'deploy',
				},
				{
					message: 'Support ticket #4821 resolved (avg 4.9★)',
					time: '22 min ago',
					type: 'support',
				},
				{
					message: 'Globex Inc upgraded from Starter to Pro',
					time: '31 min ago',
					type: 'sale',
				},
				{
					message: '12 new signups from Product Hunt campaign',
					time: '45 min ago',
					type: 'signup',
				},
			],
		},
	},
};

export type MockPhase = {
	delayMs: number;
	message: Record<string, unknown>;
	label: string;
};

export const MOCK_PHASES: MockPhase[] = [
	{ delayMs: 0, message: p1_createSurface, label: 'Surface created' },
	{ delayMs: 200, message: p2_skeleton, label: 'Layout skeleton' },
	{ delayMs: 700, message: p3_alert, label: 'Alert loaded' },
	{ delayMs: 1300, message: p4_kpis, label: 'KPIs loaded' },
	{ delayMs: 2100, message: p5_chartsAndStatus, label: 'Charts & status' },
	{ delayMs: 2800, message: p6_salesAndProducts, label: 'Sales & products' },
	{ delayMs: 3400, message: p7_activity, label: 'Activity feed' },
	{ delayMs: 3800, message: p8_data, label: 'Data bound' },
];
