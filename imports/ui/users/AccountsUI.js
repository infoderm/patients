import React from 'react';

import Dashboard from './Dashboard';
import SignInForm from './SignInForm';

export default function AccountsUI({currentUser, ...rest}) {
	return (
		<div {...rest}>
			{currentUser ? <Dashboard currentUser={currentUser} /> : <SignInForm />}
		</div>
	);
}
