import React from 'react';
import {Link} from 'react-router-dom';

import {styled} from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';

export const Subheader = styled(Grid)(({theme}) => ({
	position: 'fixed',
	top: '76px',
	paddingTop: '0.4em',
	paddingBottom: theme.spacing(1),
	zIndex: 10,
	marginLeft: '-24px',
	marginRight: '-24px',
	backgroundColor: theme.palette.mode === 'light' ? 'white' : 'black',
	boxShadow:
		theme.palette.mode === 'light'
			? '0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
			: '0px 2px 4px -1px rgba(255, 255, 255, 0.2),0px 4px 5px 0px rgba(255, 255, 255, 0.14),0px 1px 10px 0px rgba(255, 255, 255, 0.12)',
}));

const avatarStyles = {
	width: '48px',
	height: '48px',
};

export const SubheaderAvatar = styled(Avatar)(avatarStyles);

export const UnstyledLinkedAvatar = ({to, ...rest}) => {
	return <Avatar component={Link} to={to} {...rest} />;
};

export const LinkedSubheaderAvatar = styled(UnstyledLinkedAvatar)(avatarStyles);
