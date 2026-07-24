import { createComponentImplementation } from '@a2ui/react/v0_9';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { z } from 'zod';

const FALLBACK_STATUS_STYLE = {
	bg: '#f9fafb',
	color: '#6b7280',
	dot: '#9ca3af',
};
const STATUS_STYLES: Record<
	string,
	{ bg: string; color: string; dot: string }
> = {
	healthy: { bg: '#ecfdf5', color: '#065f46', dot: '#10b981' },
	warning: { bg: '#fffbeb', color: '#92400e', dot: '#f59e0b' },
	critical: { bg: '#fef2f2', color: '#991b1b', dot: '#ef4444' },
	info: { bg: '#eff6ff', color: '#1e40af', dot: '#3b82f6' },
	inactive: FALLBACK_STATUS_STYLE,
};

export type StatusBadgeProps = {
	label: string;
	status: string;
	description?: string;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
	label,
	status,
	description,
}) => {
	const style = STATUS_STYLES[status ?? 'inactive'] ?? FALLBACK_STATUS_STYLE;
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '0.625rem 0.875rem',
				background: 'white',
				borderRadius: '0.5rem',
				border: '1px solid #f3f4f6',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
				<div
					style={{
						width: '0.5rem',
						height: '0.5rem',
						borderRadius: '9999px',
						background: style.dot,
						flexShrink: 0,
						boxShadow: `0 0 0 2px ${style.bg}`,
					}}
				/>
				<span
					style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}
				>
					{label}
				</span>
				{description != null && (
					<span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
						{description}
					</span>
				)}
			</div>
			<span
				style={{
					fontSize: '0.6875rem',
					fontWeight: 700,
					color: style.color,
					background: style.bg,
					padding: '0.125rem 0.5rem',
					borderRadius: '9999px',
					textTransform: 'uppercase',
					letterSpacing: '0.05em',
				}}
			>
				{status}
			</span>
		</div>
	);
};

const StatusBadgeApi = {
	name: 'StatusBadge',
	schema: z.object({
		label: CommonSchemas.DynamicString,
		status: CommonSchemas.DynamicString,
		description: CommonSchemas.DynamicString.optional(),
	}),
};

export const A2uiStatusBadge = createComponentImplementation(
	StatusBadgeApi,
	({ props }) => (
		<StatusBadge
			label={props.label}
			status={props.status}
			description={props.description}
		/>
	),
);
