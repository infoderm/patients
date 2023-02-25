import React from 'react';

import {styled} from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';
import type PropsOf from '../../lib/types/PropsOf';

type Props = {
	expands?: boolean;
} & PropsOf<typeof InputBase>;

const StyledInputBase = styled(InputBase, {
	shouldForwardProp: (prop) => prop !== 'expands',
})<Props>(({theme, expands}) => ({
	color: 'inherit',
	display: 'inline-flex',
	flexGrow: 1,
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		transition: theme.transitions.create('width'),
		width: '100%',
		...(expands && {
			[theme.breakpoints.up('sm')]: {
				width: '18ch',
				'&:focus': {
					width: '30ch',
				},
			},
		}),
	},
}));

const SearchBoxInternalsInput = ({'aria-label': ariaLabel, ...rest}: Props) => {
	return (
		<StyledInputBase
			type="search"
			inputProps={{
				'aria-label': ariaLabel,
			}}
			{...rest}
		/>
	);
};

export default SearchBoxInternalsInput;
