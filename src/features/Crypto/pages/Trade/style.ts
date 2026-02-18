import { Link } from '@tanstack/react-router';

import { styled } from '@/utils/ui/styled';

export const PageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
  boxSizing: 'border-box',
  backgroundColor: '#0d1117',
  color: '#c9d1d9',
});

export const Toolbar = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.75rem 1.5rem',
  borderBottom: '1px solid #30363d',
  flexWrap: 'wrap',
  position: 'relative',
  zIndex: 11,
});

export const TimeframeButton = styled('button')({
  padding: '0.375rem 0.75rem',
  border: '1px solid #30363d',
  borderRadius: '6px',
  backgroundColor: 'transparent',
  color: '#c9d1d9',
  cursor: 'pointer',
  fontSize: '0.8125rem',
  fontWeight: 500,
  transition: 'all 0.15s ease',
  $nest: {
    '&:hover': {
      backgroundColor: '#21262d',
      borderColor: '#8b949e',
    },
  },
});

export const ActiveTimeframeButton = styled('button')({
  padding: '0.375rem 0.75rem',
  border: '1px solid #58a6ff',
  borderRadius: '6px',
  backgroundColor: 'rgba(56, 139, 253, 0.15)',
  color: '#58a6ff',
  cursor: 'pointer',
  fontSize: '0.8125rem',
  fontWeight: 600,
});

export const SymbolSelect = styled('select')({
  padding: '0.375rem 0.5rem',
  border: '1px solid #30363d',
  borderRadius: '6px',
  backgroundColor: '#161b22',
  color: '#c9d1d9',
  fontSize: '0.8125rem',
  cursor: 'pointer',
});

export const ChartGrid = styled('div')({
  flex: 1,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
  gap: '1px',
  backgroundColor: '#30363d',
  overflow: 'auto',
});

export const ChartCell = styled('div')({
  backgroundColor: '#0d1117',
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
});

export const ChartHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.25rem 0.5rem 0.5rem',
});

export const SymbolLink = styled(Link)({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#f0f6fc',
  textDecoration: 'none',
  $nest: {
    '&:hover': {
      color: '#58a6ff',
      textDecoration: 'underline',
    },
  },
});

export const PairLabel = styled('span')({
  fontSize: '0.75rem',
  color: '#8b949e',
  marginLeft: '0.25rem',
});

export const RemoveButton = styled('button')({
  padding: '0.125rem 0.375rem',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: 'transparent',
  color: '#8b949e',
  cursor: 'pointer',
  fontSize: '0.75rem',
  $nest: {
    '&:hover': {
      backgroundColor: '#21262d',
      color: '#f85149',
    },
  },
});

export const LoadingOverlay = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: '#8b949e',
  fontSize: '0.875rem',
});

export const ErrorOverlay = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '300px',
  color: '#f85149',
  fontSize: '0.875rem',
});

export const AddSymbolArea = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginLeft: 'auto',
});
