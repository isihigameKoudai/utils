import { Link } from '@tanstack/react-router';

import { styled } from '@/utils/ui/styled';

export const PageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100dvh',
  backgroundColor: '#0d1117',
  color: '#c9d1d9',
  padding: '1rem 1.25rem 1.25rem',
  boxSizing: 'border-box',
  gap: '1rem',
});

export const Header = styled('header')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  flexWrap: 'wrap',
});

export const BackLink = styled(Link)({
  color: '#58a6ff',
  textDecoration: 'none',
  fontSize: '0.875rem',
  $nest: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

export const TokenLabel = styled('strong')({
  fontSize: '0.875rem',
  color: '#f0f6fc',
});

export const ChartGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '0.75rem',
  flex: 1,
});

export const ChartCell = styled('section')({
  border: '1px solid #30363d',
  borderRadius: '8px',
  backgroundColor: '#161b22',
  padding: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const TimeframeLabel = styled('h2')({
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#f0f6fc',
});

export const Overlay = styled('div')({
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.875rem',
  color: '#8b949e',
});

export const ErrorText = styled('p')({
  margin: 0,
  color: '#f85149',
  fontSize: '0.875rem',
});
