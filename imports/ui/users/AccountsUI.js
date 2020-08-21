import React from 'react';

import Dashboard from './Dashboard.js';
import SignInForm from './SignInForm.js';

export default function AccountsUI({currentUser, ...rest}) {
	return (
		<div {...rest}>
			{currentUser ? <Dashboard currentUser={currentUser} /> : <SignInForm />}
		</div>
	);
}
