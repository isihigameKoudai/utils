import { createFileRoute } from '@tanstack/react-router';

import { CsvSpreadsheetPage } from '../features/CsvSpreadsheet/pages/CsvSpreadsheetPage';

export const Route = createFileRoute('/csv-spreadsheet')({
  component: CsvSpreadsheetPage,
});
