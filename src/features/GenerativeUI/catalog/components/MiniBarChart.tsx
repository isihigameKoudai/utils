import { createComponentImplementation } from '@a2ui/react/v0_9';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { z } from 'zod';

export type MiniBarChartProps = {
	title: string;
	values: unknown;
	labels?: string[];
	color?: string;
	unit?: string;
};

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
	title,
	values: rawValues,
	labels,
	color,
	unit,
}) => {
	const values: number[] = Array.isArray(rawValues)
		? rawValues.map((v) => Number(v))
		: [];
	const resolvedLabels = labels ?? [];
	const resolvedColor = color ?? '#6366f1';
	const max = values.length > 0 ? Math.max(...values, 1) : 1;

	return (
		<div
			style={{
				padding: '1rem 1.25rem',
				background: 'white',
				borderRadius: '0.75rem',
				border: '1px solid #e5e7eb',
				boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
			}}
		>
			<div
				style={{
					fontSize: '0.8125rem',
					fontWeight: 600,
					color: '#374151',
					marginBottom: '0.75rem',
				}}
			>
				{title}
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-end',
					gap: '0.25rem',
					height: '5rem',
				}}
			>
				{values.map((v, i) => {
					const pct = Math.round((v / max) * 100);
					const label = resolvedLabels[i] ?? String(i + 1);
					return (
						<div
							key={label}
							style={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '0.25rem',
								height: '100%',
								justifyContent: 'flex-end',
							}}
						>
							<div
								style={{
									width: '100%',
									height: `${pct}%`,
									background:
										i === values.length - 1
											? resolvedColor
											: `${resolvedColor}66`,
									borderRadius: '0.1875rem 0.1875rem 0 0',
									transition: 'height 0.5s ease',
									minHeight: '4px',
								}}
							/>
							<span
								style={{
									fontSize: '0.625rem',
									color: '#9ca3af',
									whiteSpace: 'nowrap',
								}}
							>
								{label}
							</span>
						</div>
					);
				})}
			</div>
			{unit != null && (
				<div
					style={{
						marginTop: '0.5rem',
						fontSize: '0.6875rem',
						color: '#9ca3af',
						textAlign: 'right',
					}}
				>
					{unit}
				</div>
			)}
		</div>
	);
};

const MiniBarChartApi = {
	name: 'MiniBarChart',
	schema: z.object({
		title: CommonSchemas.DynamicString,
		values: CommonSchemas.DynamicValue,
		labels: z.array(z.string()).optional(),
		color: z.string().optional(),
		unit: CommonSchemas.DynamicString.optional(),
	}),
};

export const A2uiMiniBarChart = createComponentImplementation(
	MiniBarChartApi,
	({ props }) => (
		<MiniBarChart
			title={props.title}
			values={props.values}
			labels={props.labels}
			color={props.color}
			unit={props.unit}
		/>
	),
);
