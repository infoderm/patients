import React from 'react';
import type PropsOf from '../../util/PropsOf';
import Tooltip from './Tooltip';

type Props<C> = PropsOf<C> & {tooltip?: string};
type Transform<C> = (props: PropsOf<C>, tooltip: string) => string;

const addTooltip = (
	Component: React.ElementType,
	transform: Transform<typeof Component> = (_props, tooltip) => tooltip,
) =>
	React.forwardRef(({tooltip, ...rest}: Props<typeof Component>, ref) => {
		const title = transform(rest, tooltip);

		return title ? (
			<Tooltip title={title}>
				<Component ref={ref} {...rest} />
			</Tooltip>
		) : (
			<Component ref={ref} {...rest} />
		);
	});

export default addTooltip;
