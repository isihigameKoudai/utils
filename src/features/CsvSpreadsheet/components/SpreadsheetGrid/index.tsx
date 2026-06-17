import { useEffect, useRef, useState } from 'react';

import {
  CsvSpreadsheetStore,
  type CellPosition,
} from '../../stores/spreadsheet';

import {
  Cell,
  CellInput,
  CellText,
  Container,
  CornerCell,
  ColHeaderCell,
  EmptyIcon,
  EmptyState,
  EmptySubText,
  EmptyTitle,
  RowNumberCell,
  StyledTable,
  TableWrapper,
} from './style';

const getColLabel = (n: number): string => {
  let label = '';
  let num = n + 1;
  while (num > 0) {
    const rem = (num - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    num = Math.floor((num - 1) / 26);
  }
  return label;
};

type DragState = { type: 'row' | 'col'; index: number };

export const SpreadsheetGrid = () => {
  const { queries, actions } = CsvSpreadsheetStore.useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  useEffect(() => {
    if (queries.editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [queries.editingCell]);

  useEffect(() => {
    if (queries.selectedCell) {
      const el = document.getElementById(
        `cell-${queries.selectedCell.row}-${queries.selectedCell.col}`,
      );
      el?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [queries.selectedCell]);

  const handleRowDragStart = (e: React.DragEvent, ri: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(ri));
    setDragState({ type: 'row', index: ri });
  };

  const handleRowDragOver = (e: React.DragEvent, ri: number) => {
    if (dragState?.type !== 'row') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropIndex !== ri) setDropIndex(ri);
  };

  const handleRowDrop = (ri: number) => {
    if (!dragState || dragState.type !== 'row') return;
    if (dragState.index !== ri) {
      actions.moveRow({ from: dragState.index, to: ri });
    }
    setDragState(null);
    setDropIndex(null);
  };

  const handleColDragStart = (e: React.DragEvent, ci: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(ci));
    setDragState({ type: 'col', index: ci });
  };

  const handleColDragOver = (e: React.DragEvent, ci: number) => {
    if (dragState?.type !== 'col') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropIndex !== ci) setDropIndex(ci);
  };

  const handleColDrop = (ci: number) => {
    if (!dragState || dragState.type !== 'col') return;
    if (dragState.index !== ci) {
      actions.moveColumn({ from: dragState.index, to: ci });
    }
    setDragState(null);
    setDropIndex(null);
  };

  const handleDragEnd = () => {
    setDragState(null);
    setDropIndex(null);
  };

  const handleCellClick = (pos: CellPosition) => {
    if (queries.editingCell) {
      actions.commitEdit();
    }
    actions.selectCell(pos);
    containerRef.current?.focus();
  };

  const handleCellDoubleClick = (pos: CellPosition) => {
    actions.startEditing(pos);
  };

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (queries.editingCell) return;
    const sel = queries.selectedCell;
    if (!sel) return;

    const { row, col } = sel;
    const rc = queries.rowCount;
    const cc = queries.colCount;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (row > 0) actions.selectCell({ row: row - 1, col });
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (row < rc - 1) actions.selectCell({ row: row + 1, col });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (col > 0) actions.selectCell({ row, col: col - 1 });
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (col < cc - 1) actions.selectCell({ row, col: col + 1 });
        break;
      case 'Enter':
      case 'F2':
        e.preventDefault();
        actions.startEditing({ row, col });
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        actions.clearCell({ row, col });
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          actions.startEditing({ row, col });
          actions.setEditValue(e.key);
        }
        break;
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const editingCell = queries.editingCell;
    if (!editingCell) return;

    const { row, col } = editingCell;
    const rc = queries.rowCount;
    const cc = queries.colCount;

    switch (e.key) {
      case 'Enter': {
        e.preventDefault();
        actions.commitEdit();
        const nextRow = row < rc - 1 ? row + 1 : row;
        actions.selectCell({ row: nextRow, col });
        containerRef.current?.focus();
        break;
      }
      case 'Tab': {
        e.preventDefault();
        actions.commitEdit();
        if (e.shiftKey) {
          const prevCol = col > 0 ? col - 1 : cc - 1;
          const prevRow = col > 0 ? row : Math.max(0, row - 1);
          actions.selectCell({ row: prevRow, col: prevCol });
        } else {
          const nextCol = col < cc - 1 ? col + 1 : 0;
          const nextRow = col < cc - 1 ? row : Math.min(rc - 1, row + 1);
          actions.selectCell({ row: nextRow, col: nextCol });
        }
        containerRef.current?.focus();
        break;
      }
      case 'Escape':
        e.preventDefault();
        actions.cancelEdit();
        containerRef.current?.focus();
        break;
      case 'ArrowDown': {
        e.preventDefault();
        actions.commitEdit();
        if (row < rc - 1) actions.selectCell({ row: row + 1, col });
        containerRef.current?.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        actions.commitEdit();
        if (row > 0) actions.selectCell({ row: row - 1, col });
        containerRef.current?.focus();
        break;
      }
    }
  };

  if (!queries.hasData) {
    return (
      <EmptyState>
        <EmptyIcon>📄</EmptyIcon>
        <EmptyTitle>CSVファイルが読み込まれていません</EmptyTitle>
        <EmptySubText>
          上部のツールバーから「CSV読み込み」ボタンでファイルを選択してください
        </EmptySubText>
      </EmptyState>
    );
  }

  const rows = queries.rows;
  const colCount = queries.colCount;

  return (
    <Container
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleContainerKeyDown}
      aria-label="スプレッドシート"
    >
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <CornerCell />
              {Array.from({ length: colCount }, (_, ci) => (
                <ColHeaderCell
                  key={ci}
                  draggable
                  onDragStart={(e) => handleColDragStart(e, ci)}
                  onDragOver={(e) => handleColDragOver(e, ci)}
                  onDrop={() => handleColDrop(ci)}
                  onDragEnd={handleDragEnd}
                  data-dragging={
                    dragState?.type === 'col' && dragState.index === ci
                      ? 'true'
                      : undefined
                  }
                  data-drop={
                    dragState?.type === 'col' &&
                    dropIndex === ci &&
                    dragState.index !== ci
                      ? 'true'
                      : undefined
                  }
                >
                  {getColLabel(ci)}
                </ColHeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <RowNumberCell
                  draggable
                  onDragStart={(e) => handleRowDragStart(e, ri)}
                  onDragOver={(e) => handleRowDragOver(e, ri)}
                  onDrop={() => handleRowDrop(ri)}
                  onDragEnd={handleDragEnd}
                  data-dragging={
                    dragState?.type === 'row' && dragState.index === ri
                      ? 'true'
                      : undefined
                  }
                  data-drop={
                    dragState?.type === 'row' &&
                    dropIndex === ri &&
                    dragState.index !== ri
                      ? 'true'
                      : undefined
                  }
                >
                  {ri + 1}
                </RowNumberCell>
                {row.map((cell, ci) => {
                  const isSelected =
                    queries.selectedCell?.row === ri &&
                    queries.selectedCell?.col === ci;
                  const isEditing =
                    queries.editingCell?.row === ri &&
                    queries.editingCell?.col === ci;
                  const isHeader = ri === 0;

                  return (
                    <Cell
                      key={ci}
                      id={`cell-${ri}-${ci}`}
                      data-selected={isSelected ? 'true' : undefined}
                      data-header={isHeader ? 'true' : undefined}
                      data-row-drag={
                        dragState?.type === 'row' && dragState.index === ri
                          ? 'true'
                          : undefined
                      }
                      data-col-drag={
                        dragState?.type === 'col' && dragState.index === ci
                          ? 'true'
                          : undefined
                      }
                      data-row-drop={
                        dragState?.type === 'row' &&
                        dropIndex === ri &&
                        dragState.index !== ri
                          ? 'true'
                          : undefined
                      }
                      data-col-drop={
                        dragState?.type === 'col' &&
                        dropIndex === ci &&
                        dragState.index !== ci
                          ? 'true'
                          : undefined
                      }
                      onClick={() => handleCellClick({ row: ri, col: ci })}
                      onDoubleClick={() =>
                        handleCellDoubleClick({ row: ri, col: ci })
                      }
                      onDragOver={(e) => {
                        if (dragState?.type === 'row') handleRowDragOver(e, ri);
                        else if (dragState?.type === 'col')
                          handleColDragOver(e, ci);
                      }}
                      onDrop={() => {
                        if (dragState?.type === 'row') handleRowDrop(ri);
                        else if (dragState?.type === 'col') handleColDrop(ci);
                      }}
                    >
                      {isEditing ? (
                        <CellInput
                          ref={inputRef}
                          id="cell-edit-input"
                          name="cell-value"
                          type="text"
                          value={queries.editValue}
                          onChange={(e) => actions.setEditValue(e.target.value)}
                          onKeyDown={handleInputKeyDown}
                          onBlur={() => actions.commitEdit()}
                          aria-label={`${ri + 1}行 ${getColLabel(ci)}列`}
                        />
                      ) : (
                        <CellText data-header={isHeader ? 'true' : undefined}>
                          {cell}
                        </CellText>
                      )}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
    </Container>
  );
};
