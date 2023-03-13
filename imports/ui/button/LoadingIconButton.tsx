import React from 'react';

import {styled} from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import IconButton, {type IconButtonProps} from '@mui/material/IconButton';
import MuiBox from '@mui/material/Box';
import addTooltip from '../accessibility/addTooltip';

type LoadingIconButtonExtraProps = {
	loading?: boolean;
	size?: 'medium' | 'large' | 'small';
};

const Box = styled(MuiBox)({
	position: 'relative',
	display: 'inline',
});

const getTopFromsize = (size: number) => {
	switch (size) {
		case 40: {
			return -8;
		}

		case 48: {
			return -12;
		}

		case 32: {
			return -6;
		}

		default: {
			return -8;
		}
	}
};

const getProgressSizeFromButtonSize = (size: string) => {
	switch (size) {
		case 'medium': {
			return 40;
		}

		case 'large': {
			return 48;
		}

		case 'small': {
			return 32;
		}

		default: {
			return 40;
		}
	}
};

const Progress = styled(CircularProgress)(({size}: {size: number}) => ({
	position: 'absolute',
	top: getTopFromsize(size),
	left: 0,
	zIndex: 1,
}));

const DEFAULT_SIZE = 'medium';

const LoadingIconButton = React.forwardRef(
	(
		{
			loading = false,
			disabled,
			size = DEFAULT_SIZE,
			component = undefined,
			...rest
		}: IconButtonProps<typeof component> & LoadingIconButtonExtraProps,
		ref,
	) => {
		return (
			<Box>
				<IconButton
					ref={ref}
					component={component}
					disabled={loading || disabled}
					size={size}
					{...rest}
				/>
				{loading && <Progress size={getProgressSizeFromButtonSize(size)} />}
			</Box>
		);
	},
);

export default addTooltip(LoadingIconButton);
