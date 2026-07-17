/**
 * npm i react typestyle
 * npm i -D @types/react
 */

import {
	type ComponentPropsWithRef,
	createElement,
	type ElementType,
	forwardRef,
} from 'react';
import { style as _style, type types } from 'typestyle';

type StyledOptions = {
	className?: string;
};

/**
 * スタイル付きコンポーネントを作成するユーティリティ関数
 * @param {T} Component - スタイリング対象のHTML要素またはコンポーネント
 * @returns {Object} スタイル
 * @example
 * const StyledDiv = styled('div')({
 *   color: 'red',
 *   fontSize: '16px',
 *   $nest: {
 *     '&:hover': {
 *       color: 'blue',
 *     }
 *   }
 * })
 */
export function styled<T extends ElementType>(Component: T) {
	return (style: types.NestedCSSProperties) => {
		type Props = ComponentPropsWithRef<T> & StyledOptions;
		type ElementRef = T extends keyof HTMLElementTagNameMap
			? HTMLElementTagNameMap[T]
			: never;

		const StyledComponent = forwardRef<ElementRef, Props>((props, ref) => {
			const { className: parentClassName, ...rest } = props;
			const classNames = [_style(style), parentClassName]
				.filter(Boolean)
				.join(' ');

			return createElement(Component, {
				...rest,
				ref,
				className: classNames,
			});
		});

		StyledComponent.displayName = `Styled(${typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Component'})`;

		return StyledComponent;
	};
}
