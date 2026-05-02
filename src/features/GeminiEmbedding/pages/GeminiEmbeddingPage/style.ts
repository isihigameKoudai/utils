import { styled } from '@/utils/ui/styled';

export const Container = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
});

export const Title = styled('h1')({
  fontSize: '2rem',
  fontWeight: '700',
  marginBottom: '0.5rem',
  color: '#1a1a1a',
});

export const Subtitle = styled('p')({
  fontSize: '1rem',
  color: '#666',
  marginBottom: '2rem',
});

export const Section = styled('div')({
  marginBottom: '2rem',
});

export const Label = styled('label')({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#374151',
});

export const Input = styled('input')({
  width: '100%',
  padding: '0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
  $nest: {
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },
});

export const TextArea = styled('textarea')({
  width: '100%',
  padding: '0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  outline: 'none',
  resize: 'vertical',
  minHeight: '120px',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  $nest: {
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },
});

export const Button = styled('button')({
  padding: '0.75rem 1.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: 'white',
  backgroundColor: '#3b82f6',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'background-color 0.15s',
  $nest: {
    '&:hover': {
      backgroundColor: '#2563eb',
    },
    '&:disabled': {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
  },
});

export const ResultBox = styled('div')({
  padding: '1.5rem',
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '0.5rem',
  marginTop: '1rem',
});

export const ResultTitle = styled('h3')({
  fontSize: '1.125rem',
  fontWeight: '600',
  marginBottom: '1rem',
  color: '#1a1a1a',
});

export const MetadataGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
  marginBottom: '1.5rem',
});

export const MetadataItem = styled('div')({
  padding: '0.75rem',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
  border: '1px solid #e5e7eb',
});

export const MetadataLabel = styled('div')({
  fontSize: '0.75rem',
  color: '#6b7280',
  marginBottom: '0.25rem',
});

export const MetadataValue = styled('div')({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1a1a1a',
});

export const VectorPreview = styled('div')({
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  color: '#4b5563',
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '0.375rem',
  border: '1px solid #e5e7eb',
  overflowX: 'auto',
  maxHeight: '200px',
  overflowY: 'auto',
});

export const ErrorBox = styled('div')({
  padding: '1rem',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '0.375rem',
  color: '#991b1b',
  fontSize: '0.875rem',
  marginTop: '1rem',
});

export const InfoBox = styled('div')({
  padding: '1rem',
  backgroundColor: '#eff6ff',
  border: '1px solid #bfdbfe',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  color: '#1e40af',
  marginBottom: '2rem',
});
