import type { TokenDetailApi } from '../../api/tokenDetail';
import type { TokenDetailStore } from '../../stores/tokenDetail';

type TokenDetailActions = ReturnType<
  typeof TokenDetailStore.useStore
>['actions'];

export type TokenDetailServiceDeps = {
  api: TokenDetailApi;
  actions: TokenDetailActions;
};
