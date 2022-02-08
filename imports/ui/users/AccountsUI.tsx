import React from 'react';

import Box from '@mui/material/Box';

import Dashboard from './Dashboard';
import SignInForm from './SignInForm';

export default function AccountsUI({currentUser, ...rest}) {
	return (
		<Box {...rest}>
			{currentUser ? <Dashboard currentUser={currentUser} /> : <SignInForm />}
		</Box>
	);
}
