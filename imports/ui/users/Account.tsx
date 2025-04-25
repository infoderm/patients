import React from 'react';

import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import AccountDisplayNameEditor from './AccountDisplayNameEditor';

const Root = styled('div')(() => ({}));

const Title = styled(Typography)(({theme}) => ({
	textAlign: 'center',
	marginBottom: theme.spacing(3),
}));

const Property = styled('div')(({theme}) => ({
	marginBottom: theme.spacing(3),
}));

const Account = () => {
	return (
		<Root>
			<Title variant="h2">Account</Title>
			<Title variant="subtitle1">Your account details</Title>
			<Property>
				<Typography variant="h4">Display name</Typography>
				<AccountDisplayNameEditor />
			</Property>
		</Root>
	);
};

export default Account;
