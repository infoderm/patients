import React from 'react';
import PropsOf from '../../util/PropsOf';
import Tooltip from './Tooltip';

type Props<C> = PropsOf<C> & {tooltip?: string};
type Transform<C> = (props: PropsOf<C>, x: string) => string;

const addTooltip = (
	Component: React.ElementType,
	transform: Transform<typeof Component> = (_props, x) => x,
) =>
	React.forwardRef(({tooltip, ...rest}: Props<typeof Component>, ref) => {
		const title = transform(rest, tooltip);

		return title ? (
			<Tooltip title={title} aria-label={title}>
				<Component ref={ref} {...rest} />
			</Tooltip>
		) : (
			<Component ref={ref} {...rest} />
		);
	});

export default addTooltip;
