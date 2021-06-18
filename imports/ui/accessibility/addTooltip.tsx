import React from 'react';
import PropsOf from '../../util/PropsOf';
import Tooltip from './Tooltip';

type ComponentProps<C> = Omit<PropsOf<C>, 'tooltip'>;
type Transform<C> = (props: ComponentProps<C>, x: string) => string;
type Props<C> = {tooltip?: string} & PropsOf<C>;

const addTooltip =
	<C extends React.ElementType>(
		Component: C,
		transform: Transform<C> = (_props, x) => x
	) =>
	({tooltip, ...rest}: Props<C>) => {
		const title = transform(rest, tooltip);

		return title ? (
			<Tooltip title={title} aria-label={title}>
				<Component {...(rest as PropsOf<C>)} />
			</Tooltip>
		) : (
			<Component {...(rest as PropsOf<C>)} />
		);
	};

export default addTooltip;
