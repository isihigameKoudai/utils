import { styled } from '@/utils/ui/styled';

export const Page = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
});

export const Title = styled('h1')({
  fontSize: '1rem',
  fontWeight: 600,
  color: '#1e293b',
  margin: '0 0 0 0.25rem',
  padding: '0.75rem 1rem 0',
  flexShrink: 0,
  lineHeight: 1.4,
});
