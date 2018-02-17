import React from 'react';

import Dashboard from './Dashboard.js';
import SignInForm from './SignInForm.js';

export default class AccountsUI extends React.Component {
	constructor ( props ) {
		super(props);
	}
	render(){
		const { currentUser } = this.props;
		return currentUser ? <Dashboard currentUser={currentUser}/> : <SignInForm/> ;
	}
}
