import type { ReactComponentImplementation } from '@a2ui/react/v0_9';
import { basicCatalog } from '@a2ui/react/v0_9';
import { Catalog } from '@a2ui/web_core/v0_9';

import { A2uiActivityItem } from './components/ActivityItem';
import { A2uiAlertBanner } from './components/AlertBanner';
import { A2uiKpiCard } from './components/KpiCard';
import { A2uiMiniBarChart } from './components/MiniBarChart';
import { A2uiProductRow } from './components/ProductRow';
import { A2uiSalesRow } from './components/SalesRow';
import { A2uiSectionHeader } from './components/SectionHeader';
import { A2uiStatusBadge } from './components/StatusBadge';

export const MY_CATALOG_ID = 'https://myapp.example.com/generative-ui/v1';

export const myCatalog = new Catalog<ReactComponentImplementation>(
	MY_CATALOG_ID,
	[
		...basicCatalog.components.values(),
		A2uiKpiCard,
		A2uiSalesRow,
		A2uiProductRow,
		A2uiSectionHeader,
		A2uiStatusBadge,
		A2uiMiniBarChart,
		A2uiActivityItem,
		A2uiAlertBanner,
	],
	[...basicCatalog.functions.values()],
);
