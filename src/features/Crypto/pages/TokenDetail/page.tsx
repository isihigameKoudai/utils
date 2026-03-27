import { useEffect } from 'react';

import { CryptoChart } from '../../components/CryptoChart';
import type { Symbol } from '../../constants';
import { useTokenDetail } from '../../hooks/useTokenDetail';
import { getTimeframeLabel } from '../../modules/utils';

import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbText,
  ChartCell,
  ChartGrid,
  Header,
  Overlay,
  PageContainer,
  TimeframeLabel,
} from './style';

type TokenDetailPageProps = {
  token: Symbol;
};

export const TokenDetailPage = ({ token }: TokenDetailPageProps) => {
  const { queries, initialize, fetchAllTimeframes } = useTokenDetail();

  useEffect(() => {
    initialize(token);
  }, [initialize, token]);

  useEffect(() => {
    if (!queries.token) return;
    fetchAllTimeframes(queries.token);
  }, [fetchAllTimeframes, queries.token]);

  return (
    <PageContainer>
      <Header>
        <Breadcrumb>
          <BreadcrumbLink to="/trade">trade</BreadcrumbLink>
          <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
          <BreadcrumbText>{queries.token ?? token}</BreadcrumbText>
        </Breadcrumb>
      </Header>

      <ChartGrid>
        {queries.chartPanels.map(({ timeframe, data, isLoading, error }) => (
          <ChartCell key={timeframe}>
            <TimeframeLabel>{getTimeframeLabel(timeframe)}</TimeframeLabel>
            {isLoading && <Overlay>読み込み中...</Overlay>}
            {!isLoading && error && <Overlay>{error}</Overlay>}
            {!isLoading && !error && data && <CryptoChart data={data} isDark />}
            {!isLoading && !error && !data && <Overlay>データなし</Overlay>}
          </ChartCell>
        ))}
      </ChartGrid>
    </PageContainer>
  );
};
