import { createComponentImplementation } from '@a2ui/react/v0_9';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { z } from 'zod';

const RANK_COLORS = ['#f59e0b', '#9ca3af', '#b45309', '#6366f1'];

export type ProductRowProps = {
	name: string;
	units: string;
	rank: number;
	maxUnits?: number;
};

export const ProductRow: React.FC<ProductRowProps> = ({
	name,
	units,
	rank,
	maxUnits,
}) => {
	const resolvedRank = rank ?? 1;
	const numericUnits = Number(units ?? 0);
	const resolvedMaxUnits = maxUnits ?? 1500;
	const pct = Math.min(
		100,
		Math.round((numericUnits / resolvedMaxUnits) * 100),
	);
	const color =
		RANK_COLORS[(resolvedRank - 1) % RANK_COLORS.length] ?? '#6366f1';

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '0.25rem',
				padding: '0.5rem 0',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
					<span
						style={{
							width: '1.25rem',
							height: '1.25rem',
							borderRadius: '0.25rem',
							background: color,
							color: 'white',
							fontSize: '0.6875rem',
							fontWeight: 700,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexShrink: 0,
						}}
					>
						{resolvedRank}
					</span>
					<span
						style={{
							fontSize: '0.875rem',
							fontWeight: 500,
							color: '#374151',
						}}
					>
						{name}
					</span>
				</div>
				<span
					style={{
						fontSize: '0.8125rem',
						color: '#6b7280',
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{units} units
				</span>
			</div>
			<div
				style={{
					height: '4px',
					background: '#f3f4f6',
					borderRadius: '9999px',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						height: '100%',
						width: `${pct}%`,
						background: color,
						borderRadius: '9999px',
						transition: 'width 0.6s ease',
					}}
				/>
			</div>
		</div>
	);
};

const ProductRowApi = {
	name: 'ProductRow',
	schema: z.object({
		name: CommonSchemas.DynamicString,
		units: CommonSchemas.DynamicString,
		rank: CommonSchemas.DynamicNumber,
		maxUnits: CommonSchemas.DynamicNumber.optional(),
	}),
};

export const A2uiProductRow = createComponentImplementation(
	ProductRowApi,
	({ props }) => (
		<ProductRow
			name={props.name}
			units={props.units}
			rank={props.rank}
			maxUnits={props.maxUnits}
		/>
	),
);
