import { createComponentImplementation } from '@a2ui/react/v0_9';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { z } from 'zod';

export type KpiCardProps = {
	title: string;
	value: string;
	trend: string;
	trendPositive?: boolean;
};

export const KpiCard: React.FC<KpiCardProps> = ({
	title,
	value,
	trend,
	trendPositive,
}) => {
	const isPositive = trendPositive !== false;
	return (
		<div
			style={{
				padding: '1.25rem 1.5rem',
				background: 'white',
				borderRadius: '0.75rem',
				border: '1px solid #e5e7eb',
				boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
				display: 'flex',
				flexDirection: 'column',
				gap: '0.25rem',
				flex: 1,
			}}
		>
			<span
				style={{
					fontSize: '0.75rem',
					fontWeight: 600,
					color: '#6b7280',
					textTransform: 'uppercase',
					letterSpacing: '0.05em',
				}}
			>
				{title}
			</span>
			<span
				style={{
					fontSize: '2rem',
					fontWeight: 700,
					color: '#111827',
					lineHeight: 1.2,
				}}
			>
				{value}
			</span>
			<span
				style={{
					fontSize: '0.8125rem',
					fontWeight: 500,
					color: isPositive ? '#10b981' : '#ef4444',
					display: 'flex',
					alignItems: 'center',
					gap: '0.25rem',
				}}
			>
				<span>{isPositive ? '▲' : '▼'}</span>
				{trend}
			</span>
		</div>
	);
};

const KpiCardApi = {
	name: 'KpiCard',
	schema: z.object({
		title: CommonSchemas.DynamicString,
		value: CommonSchemas.DynamicString,
		trend: CommonSchemas.DynamicString,
		trendPositive: z.boolean().optional(),
	}),
};

export const A2uiKpiCard = createComponentImplementation(
	KpiCardApi,
	({ props }) => (
		<KpiCard
			title={props.title}
			value={props.value}
			trend={props.trend}
			trendPositive={props.trendPositive}
		/>
	),
);
