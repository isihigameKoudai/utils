import { CsvSpreadsheetStore } from '../../stores/spreadsheet';

import {
  ButtonGroup,
  Divider,
  FileNameBadge,
  GroupLabel,
  IconButton,
  PrimaryButton,
  Root,
  StatusText,
  SuccessButton,
} from './style';

export const Toolbar = () => {
  const { queries, actions } = CsvSpreadsheetStore.useStore();

  const hasData = queries.hasData;
  const selectedRow = queries.selectedCell?.row ?? null;
  const selectedCol = queries.selectedCell?.col ?? null;

  return (
    <Root>
      <ButtonGroup>
        <PrimaryButton type="button" onClick={() => void actions.loadCSV()}>
          CSV読み込み
        </PrimaryButton>
        <SuccessButton
          type="button"
          disabled={!hasData}
          onClick={() => actions.exportCSV()}
        >
          CSVエクスポート
        </SuccessButton>
      </ButtonGroup>

      <Divider />

      <ButtonGroup>
        <GroupLabel>行</GroupLabel>
        <IconButton
          type="button"
          disabled={!hasData}
          onClick={() => actions.addRow()}
          aria-label="行を追加"
          title="行を追加"
        >
          +
        </IconButton>
        <IconButton
          type="button"
          disabled={!hasData || selectedRow === null || selectedRow === 0}
          onClick={() => {
            if (selectedRow !== null) {
              actions.deleteRow({ row: selectedRow });
            }
          }}
          aria-label="選択行を削除"
          title="選択行を削除"
        >
          −
        </IconButton>
      </ButtonGroup>

      <ButtonGroup>
        <GroupLabel>列</GroupLabel>
        <IconButton
          type="button"
          disabled={!hasData}
          onClick={() => actions.addColumn()}
          aria-label="列を追加"
          title="列を追加"
        >
          +
        </IconButton>
        <IconButton
          type="button"
          disabled={!hasData || selectedCol === null}
          onClick={() => {
            if (selectedCol !== null) {
              actions.deleteColumn({ col: selectedCol });
            }
          }}
          aria-label="選択列を削除"
          title="選択列を削除"
        >
          −
        </IconButton>
      </ButtonGroup>

      {hasData && (
        <StatusText>
          {queries.rowCount}行 × {queries.colCount}列
        </StatusText>
      )}

      {queries.fileName && (
        <FileNameBadge title={queries.fileName}>
          {queries.fileName}
        </FileNameBadge>
      )}
    </Root>
  );
};
