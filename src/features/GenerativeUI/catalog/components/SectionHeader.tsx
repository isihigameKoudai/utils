import { createComponentImplementation } from '@a2ui/react/v0_9';
import { CommonSchemas } from '@a2ui/web_core/v0_9';
import { z } from 'zod';

export type SectionHeaderProps = {
	title: string;
	subtitle?: string;
	accentColor?: string;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
	title,
	subtitle,
	accentColor,
}) => {
	const accent = accentColor ?? '#6366f1';
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '0.125rem',
				padding: '0.5rem 0 1rem',
				borderBottom: `3px solid ${accent}`,
				marginBottom: '1rem',
			}}
		>
			<span
				style={{
					fontSize: '1.125rem',
					fontWeight: 700,
					color: '#111827',
					letterSpacing: '-0.01em',
				}}
			>
				{title}
			</span>
			{subtitle != null && (
				<span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
					{subtitle}
				</span>
			)}
		</div>
	);
};

const SectionHeaderApi = {
	name: 'SectionHeader',
	schema: z.object({
		title: CommonSchemas.DynamicString,
		subtitle: CommonSchemas.DynamicString.optional(),
		accentColor: z.string().optional(),
	}),
};

export const A2uiSectionHeader = createComponentImplementation(
	SectionHeaderApi,
	({ props }) => (
		<SectionHeader
			title={props.title}
			subtitle={props.subtitle}
			accentColor={props.accentColor}
		/>
	),
);
