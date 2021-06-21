import React from 'react';
import PropsOf from '../../util/PropsOf';
import Tooltip from './Tooltip';

type ComponentWithoutTooltip<C> = PropsOf<C> extends {tooltip?: any}
	? never
	: C;
type Transform<C> = (props: PropsOf<C>, x: string) => string;
type Props<C> = PropsOf<C> & {tooltip?: string};

const addTooltip =
	<C extends React.ElementType>(
		Component: ComponentWithoutTooltip<C>,
		transform: Transform<C> = (_props, x) => x
	) =>
	({tooltip, ...rest}: Props<C>) => {
		const title = transform(rest as PropsOf<C>, tooltip);

		return title ? (
			<Tooltip title={title} aria-label={title}>
				<Component {...(rest as PropsOf<C>)} />
			</Tooltip>
		) : (
			<Component {...(rest as PropsOf<C>)} />
		);
	};

export default addTooltip;
