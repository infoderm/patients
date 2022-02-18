import React from 'react';

import {styled} from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import IconButton, {IconButtonProps} from '@mui/material/IconButton';
import addTooltip from '../accessibility/addTooltip';

interface LoadingIconButtonExtraProps {
	pending?: boolean;
}

const Wrap = styled('span')({
	position: 'relative',
});

const Progress = styled(CircularProgress)({
	position: 'absolute',
	top: -8,
	left: 0,
	zIndex: 1,
});

const LoadingIconButton = React.forwardRef(
	(
		{
			pending = false,
			disabled,
			component = undefined,
			...rest
		}: IconButtonProps<typeof component> & LoadingIconButtonExtraProps,
		ref,
	) => {
		return (
			<Wrap>
				<IconButton
					ref={ref}
					component={component}
					disabled={disabled || pending}
					{...rest}
				/>
				{pending && <Progress size={40} />}
			</Wrap>
		);
	},
);

export default addTooltip(LoadingIconButton);
