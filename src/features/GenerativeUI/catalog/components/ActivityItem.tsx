import { createComponentImplementation } from '@a2ui/react/v0_9';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { z } from 'zod';

const FALLBACK_ACTIVITY_CFG = { icon: '📌', bg: '#f9fafb', color: '#6b7280' };
const TYPE_CONFIG: Record<string, { icon: string; bg: string; color: string }> =
	{
		sale: { icon: '💰', bg: '#ecfdf5', color: '#059669' },
		signup: { icon: '👤', bg: '#eff6ff', color: '#3b82f6' },
		alert: { icon: '⚠️', bg: '#fffbeb', color: '#d97706' },
		deploy: { icon: '🚀', bg: '#f5f3ff', color: '#7c3aed' },
		support: { icon: '💬', bg: '#fdf4ff', color: '#a21caf' },
		default: FALLBACK_ACTIVITY_CFG,
	};

export type ActivityItemProps = {
	message: string;
	time: string;
	type?: string;
};

export const ActivityItem: React.FC<ActivityItemProps> = ({
	message,
	time,
	type,
}) => {
	const cfg = TYPE_CONFIG[type ?? 'default'] ?? FALLBACK_ACTIVITY_CFG;
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				gap: '0.625rem',
				padding: '0.5rem 0',
				borderBottom: '1px solid #f9fafb',
			}}
		>
			<div
				style={{
					width: '1.75rem',
					height: '1.75rem',
					borderRadius: '9999px',
					background: cfg.bg,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '0.75rem',
					flexShrink: 0,
				}}
			>
				{cfg.icon}
			</div>
			<div style={{ flex: 1, minWidth: 0 }}>
				<p
					style={{
						margin: 0,
						fontSize: '0.8125rem',
						color: '#374151',
						lineHeight: 1.4,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{message}
				</p>
				<span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{time}</span>
			</div>
		</div>
	);
};

const ActivityItemApi = {
	name: 'ActivityItem',
	schema: z.object({
		message: CommonSchemas.DynamicString,
		time: CommonSchemas.DynamicString,
		type: CommonSchemas.DynamicString.optional(),
	}),
};

export const A2uiActivityItem = createComponentImplementation(
	ActivityItemApi,
	({ props }) => (
		<ActivityItem message={props.message} time={props.time} type={props.type} />
	),
);
