import { createComponentImplementation } from '@a2ui/react/v0_9';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { z } from 'zod';

const FALLBACK_VARIANT_CFG = {
	bg: '#eff6ff',
	border: '#93c5fd',
	color: '#1e40af',
	icon: 'ℹ️',
};
const VARIANT_CONFIG: Record<
	string,
	{ bg: string; border: string; color: string; icon: string }
> = {
	success: { bg: '#f0fdf4', border: '#86efac', color: '#166534', icon: '✅' },
	warning: { bg: '#fffbeb', border: '#fcd34d', color: '#92400e', icon: '⚠️' },
	error: { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b', icon: '❌' },
	info: FALLBACK_VARIANT_CFG,
};

export type AlertBannerProps = {
	message: string;
	variant?: string;
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
	message,
	variant,
}) => {
	const cfg = VARIANT_CONFIG[variant ?? 'info'] ?? FALLBACK_VARIANT_CFG;
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'flex-start',
				gap: '0.625rem',
				padding: '0.75rem 1rem',
				background: cfg.bg,
				border: `1px solid ${cfg.border}`,
				borderRadius: '0.5rem',
			}}
		>
			<span style={{ fontSize: '1rem', flexShrink: 0 }}>{cfg.icon}</span>
			<span style={{ fontSize: '0.875rem', color: cfg.color, lineHeight: 1.5 }}>
				{message}
			</span>
		</div>
	);
};

const AlertBannerApi = {
	name: 'AlertBanner',
	schema: z.object({
		message: CommonSchemas.DynamicString,
		variant: CommonSchemas.DynamicString.optional(),
	}),
};

export const A2uiAlertBanner = createComponentImplementation(
	AlertBannerApi,
	({ props }) => (
		<AlertBanner message={props.message} variant={props.variant} />
	),
);
