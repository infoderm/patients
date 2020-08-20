import React from 'react';

import { useSnackbar } from 'notistack' ;

import Dashboard from './Dashboard.js';
import SignInForm from './SignInForm.js';

export default function AccountsUI ( { currentUser , ...rest } ) {

	const { enqueueSnackbar } = useSnackbar();

	const feedback = message => enqueueSnackbar(message);

	return (
		<div {...rest}>
			{ currentUser ? <Dashboard currentUser={currentUser} feedback={feedback}/> : <SignInForm feedback={feedback}/> }
		</div>
	) ;

}
