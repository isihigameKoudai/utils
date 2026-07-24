import type React from 'react';

import { styled } from '@/utils/ui/styled';

export const Container = styled('div')({
	maxWidth: '1200px',
	margin: '0 auto',
	padding: '2rem',
	fontFamily: 'system-ui, -apple-system, sans-serif',
});

export const ControlBar = styled('div')({
	display: 'flex',
	gap: '1rem',
	alignItems: 'center',
	marginBottom: '2rem',
	flexWrap: 'wrap',
});

export const PlayButton = styled('button')({
	padding: '0.75rem 1.5rem',
	fontSize: '0.875rem',
	fontWeight: '600',
	color: 'white',
	backgroundColor: '#6366f1',
	border: 'none',
	borderRadius: '0.5rem',
	cursor: 'pointer',
	transition: 'background-color 0.15s',
	$nest: {
		'&:hover': { backgroundColor: '#4f46e5' },
		'&:disabled': { backgroundColor: '#9ca3af', cursor: 'not-allowed' },
	},
});

export const ResetButton = styled('button')({
	padding: '0.75rem 1.5rem',
	fontSize: '0.875rem',
	fontWeight: '600',
	color: '#374151',
	backgroundColor: '#f3f4f6',
	border: '1px solid #d1d5db',
	borderRadius: '0.5rem',
	cursor: 'pointer',
	transition: 'background-color 0.15s',
	$nest: {
		'&:hover': { backgroundColor: '#e5e7eb' },
		'&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
	},
});

export const PhaseLog = styled('div')({
	display: 'flex',
	gap: '0.5rem',
	flexWrap: 'wrap',
	alignItems: 'center',
	flex: 1,
});

export const PhaseBadge = styled('span')({
	padding: '0.25rem 0.75rem',
	borderRadius: '9999px',
	fontSize: '0.75rem',
	fontWeight: 600,
	transition: 'all 0.3s',
});

export const phaseBadgeActiveStyle: React.CSSProperties = {
	backgroundColor: '#6366f1',
	color: 'white',
};

export const phaseBadgeInactiveStyle: React.CSSProperties = {
	backgroundColor: '#e5e7eb',
	color: '#6b7280',
};

export const SurfaceWrapper = styled('div')({
	border: '1px solid #e5e7eb',
	borderRadius: '0.75rem',
	padding: '1.5rem',
	backgroundColor: '#f8fafc',
	minHeight: '400px',
});

export const surfaceWrapperVars: React.CSSProperties = {
	colorScheme: 'light',
	color: '#111827',
	'--a2ui-color-background': '#f8fafc',
	'--a2ui-color-surface': '#ffffff',
	'--a2ui-color-on-surface': '#111827',
	'--a2ui-color-on-background': '#374151',
	'--a2ui-color-primary': '#6366f1',
	'--a2ui-border': '1px solid #e5e7eb',
	'--a2ui-spacing-m': '1rem',
} as React.CSSProperties;

export const EmptyState = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	minHeight: '400px',
	color: '#9ca3af',
	gap: '0.5rem',
});

export const EmptyIcon = styled('div')({
	fontSize: '3rem',
});

export const EmptyText = styled('p')({
	fontSize: '1rem',
	margin: 0,
});
