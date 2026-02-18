import { useCallback, useMemo } from 'react';

import { tokenDetailApi } from '../api/tokenDetail';
import type { Symbol } from '../constants';
import { createTokenDetailService } from '../services/tokenDetail';
import { TokenDetailStore } from '../stores/tokenDetail';

export const useTokenDetail = () => {
  const { queries, actions } = TokenDetailStore.useStore();

  const service = useMemo(
    () => createTokenDetailService({ api: tokenDetailApi, actions }),
    [actions],
  );

  const initialize = useCallback(
    (token: Symbol) => {
      actions.initialize({ token });
    },
    [actions],
  );

  const fetchAllTimeframes = useCallback(
    (token: Symbol) => service.fetchAllTimeframes(token),
    [service],
  );

  return {
    queries,
    initialize,
    fetchAllTimeframes,
  };
};
