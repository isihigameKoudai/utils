import { useCallback, useMemo } from 'react';

import { tokenDetailApi } from '../api/tokenDetail';
import type { TokenSymbol } from '../constants';
import { createTokenDetailService } from '../services/tokenDetail';
import { TokenDetailStore } from '../stores/tokenDetail';

export const useTokenDetail = () => {
	const { queries, actions } = TokenDetailStore.useStore();

	const service = useMemo(
		() => createTokenDetailService({ api: tokenDetailApi, actions }),
		[actions],
	);

	const initialize = useCallback(
		(token: TokenSymbol) => {
			void service.initialize(token);
		},
		[service],
	);

	const fetchAllTimeframes = useCallback(
		(token: TokenSymbol) => service.fetchAllTimeframes(token),
		[service],
	);

	return {
		queries,
		initialize,
		fetchAllTimeframes,
	};
};
