import { createFileRoute, notFound } from '@tanstack/react-router';

import { SYMBOLS, type TokenSymbol } from '../../features/Crypto/constants';
import { TokenDetailPage } from '../../features/Crypto/pages/TokenDetail';

const isSymbol = (token: string): token is TokenSymbol =>
	SYMBOLS.includes(token.toUpperCase() as TokenSymbol);

const TokenDetailRoute = () => {
	const { token } = Route.useParams();
	return <TokenDetailPage token={token.toUpperCase() as TokenSymbol} />;
};

export const Route = createFileRoute('/trade/$token')({
	beforeLoad: ({ params: { token } }) => {
		if (!isSymbol(token)) {
			throw notFound();
		}
	},
	notFoundComponent: () => {
		return <p>このトークンは対応していません</p>;
	},
	component: TokenDetailRoute,
});
