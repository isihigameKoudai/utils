import { SpreadsheetGrid } from '../../components/SpreadsheetGrid';
import { Toolbar } from '../../components/Toolbar';

import { Page, Title } from './style';

export const CsvSpreadsheetPage = () => {
  return (
    <Page>
      <Title>CSV スプレッドシート</Title>
      <Toolbar />
      <SpreadsheetGrid />
    </Page>
  );
};
