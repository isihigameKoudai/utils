import { styled } from '@/utils/ui/styled';

export const Root = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1rem',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  flexShrink: 0,
  flexWrap: 'wrap',
  minHeight: '52px',
});

export const ButtonGroup = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const Divider = styled('div')({
  width: '1px',
  height: '20px',
  backgroundColor: '#e2e8f0',
  margin: '0 0.25rem',
  flexShrink: 0,
});

export const PrimaryButton = styled('button')({
  padding: '0.375rem 0.75rem',
  fontSize: '0.8125rem',
  fontWeight: 500,
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  whiteSpace: 'nowrap',
  lineHeight: 1.5,
  $nest: {
    '&:hover': { backgroundColor: '#1d4ed8' },
    '&:active': { backgroundColor: '#1e40af' },
  },
});

export const SuccessButton = styled('button')({
  padding: '0.375rem 0.75rem',
  fontSize: '0.8125rem',
  fontWeight: 500,
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: '#16a34a',
  color: '#ffffff',
  whiteSpace: 'nowrap',
  lineHeight: 1.5,
  $nest: {
    '&:hover': { backgroundColor: '#15803d' },
    '&:active': { backgroundColor: '#166534' },
    '&:disabled': {
      backgroundColor: '#bbf7d0',
      cursor: 'not-allowed',
    },
  },
});

export const IconButton = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #e2e8f0',
  cursor: 'pointer',
  backgroundColor: '#ffffff',
  color: '#475569',
  lineHeight: 1,
  flexShrink: 0,
  $nest: {
    '&:hover': { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' },
    '&:active': { backgroundColor: '#e2e8f0' },
    '&:disabled': {
      color: '#cbd5e1',
      cursor: 'not-allowed',
      backgroundColor: '#f8fafc',
    },
  },
});

export const GroupLabel = styled('span')({
  fontSize: '0.75rem',
  color: '#94a3b8',
  whiteSpace: 'nowrap',
  userSelect: 'none',
});

export const FileNameBadge = styled('span')({
  marginLeft: 'auto',
  fontSize: '0.8125rem',
  color: '#64748b',
  backgroundColor: '#f1f5f9',
  padding: '0.25rem 0.625rem',
  borderRadius: '4px',
  maxWidth: '240px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

export const StatusText = styled('span')({
  fontSize: '0.75rem',
  color: '#94a3b8',
  whiteSpace: 'nowrap',
  userSelect: 'none',
});
