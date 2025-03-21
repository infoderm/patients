import React from 'react';

import type PropsOf from '../../util/types/PropsOf';

import Tooltip from './Tooltip';

type Props<C> = PropsOf<C> & {readonly tooltip?: string};
type Transform<C> = (props: PropsOf<C>, tooltip: string) => string;

const addTooltip = (
	Component: React.ElementType,
	transform: Transform<typeof Component> = (_props, tooltip) => tooltip,
) =>
	React.forwardRef(({tooltip, ...rest}: Props<typeof Component>, ref) => {
		const title = transform(rest, tooltip);

		return title !== undefined ? (
			<Tooltip title={title}>
				<Component ref={ref} {...rest} />
			</Tooltip>
		) : (
			<Component ref={ref} {...rest} />
		);
	});

export default addTooltip;
