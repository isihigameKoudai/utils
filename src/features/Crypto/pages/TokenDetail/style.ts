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

export const Header = styled('header')({
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 1.5rem',
  borderBottom: '1px solid #30363d',
});

export const Breadcrumb = styled('nav')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.875rem',
});

export const BreadcrumbLink = styled(Link)({
  color: '#58a6ff',
  textDecoration: 'none',
  fontWeight: 500,
  $nest: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

export const BreadcrumbSeparator = styled('span')({
  color: '#8b949e',
  userSelect: 'none',
});

export const BreadcrumbText = styled('span')({
  color: '#f0f6fc',
  fontWeight: 600,
});

export const ChartGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '1px',
  backgroundColor: '#30363d',
  flex: 1,
});

export const ChartCell = styled('section')({
  backgroundColor: '#0d1117',
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
});

export const TimeframeLabel = styled('h2')({
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#f0f6fc',
  padding: '0.25rem 0.5rem 0.5rem',
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
