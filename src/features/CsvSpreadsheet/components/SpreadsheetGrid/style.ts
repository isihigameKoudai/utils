import { styled } from '@/utils/ui/styled';

export const Container = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  outline: 'none',
});

export const TableWrapper = styled('div')({
  flex: 1,
  overflow: 'auto',
  borderTop: '1px solid #e2e8f0',
});

export const StyledTable = styled('table')({
  borderCollapse: 'collapse',
  width: 'max-content',
  minWidth: '100%',
  fontSize: '0.875rem',
});

export const CornerCell = styled('th')({
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 3,
  width: '48px',
  minWidth: '48px',
  backgroundColor: '#f1f5f9',
  borderRight: '1px solid #e2e8f0',
  borderBottom: '2px solid #cbd5e1',
});

export const ColHeaderCell = styled('th')({
  position: 'sticky',
  top: 0,
  zIndex: 2,
  padding: '4px 8px',
  minWidth: '120px',
  textAlign: 'center',
  backgroundColor: '#f1f5f9',
  color: '#64748b',
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRight: '1px solid #e2e8f0',
  borderBottom: '2px solid #cbd5e1',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  cursor: 'grab',
  $nest: {
    '&[data-dragging="true"]': { opacity: 0.4, cursor: 'grabbing' },
    '&[data-drop="true"]': { borderLeft: '3px solid #2563eb' },
  },
});

export const RowNumberCell = styled('td')({
  position: 'sticky',
  left: 0,
  zIndex: 1,
  width: '48px',
  minWidth: '48px',
  padding: '0 8px',
  textAlign: 'right',
  backgroundColor: '#f1f5f9',
  color: '#94a3b8',
  fontSize: '0.75rem',
  borderRight: '1px solid #e2e8f0',
  borderBottom: '1px solid #e2e8f0',
  userSelect: 'none',
  height: '32px',
  boxSizing: 'border-box',
  cursor: 'grab',
  $nest: {
    '&[data-dragging="true"]': { opacity: 0.4, cursor: 'grabbing' },
    '&[data-drop="true"]': { borderTop: '3px solid #2563eb' },
  },
});

export const Cell = styled('td')({
  padding: '0',
  borderRight: '1px solid #e2e8f0',
  borderBottom: '1px solid #e2e8f0',
  minWidth: '120px',
  height: '32px',
  cursor: 'cell',
  position: 'relative',
  boxSizing: 'border-box',
  $nest: {
    '&:hover': {
      backgroundColor: '#f8fafc',
    },
    '&[data-selected="true"]': {
      outline: '2px solid #2563eb',
      outlineOffset: '-2px',
      backgroundColor: '#dbeafe',
    },
    '&[data-header="true"]': {
      backgroundColor: '#f8fafc',
    },
    '&[data-header="true"][data-selected="true"]': {
      backgroundColor: '#dbeafe',
    },
    '&[data-row-drag="true"]': { opacity: 0.4 },
    '&[data-col-drag="true"]': { opacity: 0.4 },
    '&[data-row-drop="true"]': { borderTop: '3px solid #2563eb' },
    '&[data-col-drop="true"]': { borderLeft: '3px solid #2563eb' },
  },
});

export const CellText = styled('span')({
  display: 'block',
  padding: '4px 8px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  height: '100%',
  boxSizing: 'border-box',
  lineHeight: '24px',
  $nest: {
    '&[data-header="true"]': {
      fontWeight: 600,
      color: '#1e293b',
    },
  },
});

export const CellInput = styled('input')({
  display: 'block',
  width: '100%',
  height: '32px',
  padding: '4px 8px',
  border: '2px solid #2563eb',
  outline: 'none',
  backgroundColor: '#ffffff',
  fontSize: '0.875rem',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  lineHeight: '24px',
});

export const EmptyState = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  color: '#94a3b8',
  padding: '4rem 2rem',
  userSelect: 'none',
});

export const EmptyIcon = styled('div')({
  fontSize: '3rem',
  lineHeight: 1,
});

export const EmptyTitle = styled('p')({
  margin: 0,
  fontSize: '1rem',
  fontWeight: 600,
  color: '#64748b',
});

export const EmptySubText = styled('p')({
  margin: 0,
  fontSize: '0.875rem',
  textAlign: 'center',
  maxWidth: '320px',
});
