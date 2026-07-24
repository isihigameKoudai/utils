import { createComponentImplementation } from '@a2ui/react/v0_9';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { z } from 'zod';

export type SalesRowProps = {
	customer: string;
	amount: string;
};

export const SalesRow: React.FC<SalesRowProps> = ({ customer, amount }) => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: '0.625rem 0',
			borderBottom: '1px solid #f3f4f6',
		}}
	>
		<div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
			<div
				style={{
					width: '2rem',
					height: '2rem',
					borderRadius: '9999px',
					background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: 'white',
					fontSize: '0.75rem',
					fontWeight: 700,
					flexShrink: 0,
				}}
			>
				{String(customer ?? '')
					.charAt(0)
					.toUpperCase()}
			</div>
			<span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
				{customer}
			</span>
		</div>
		<span
			style={{
				fontSize: '0.8125rem',
				fontWeight: 600,
				color: '#059669',
				background: '#ecfdf5',
				padding: '0.125rem 0.5rem',
				borderRadius: '0.25rem',
			}}
		>
			{amount}
		</span>
	</div>
);

const SalesRowApi = {
	name: 'SalesRow',
	schema: z.object({
		customer: CommonSchemas.DynamicString,
		amount: CommonSchemas.DynamicString,
	}),
};

export const A2uiSalesRow = createComponentImplementation(
	SalesRowApi,
	({ props }) => <SalesRow customer={props.customer} amount={props.amount} />,
);
