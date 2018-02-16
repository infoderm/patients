import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import React from 'react';

import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Dashboard from './Dashboard.js';

class Register extends React.Component {

	render () {

		const register = event => {
			event.preventDefault();
			const username = event.target.registerUsername.value;
			const password = event.target.registerPassword.value;
			Accounts.createUser({ username, password });
		} ;

		return (
			<template name="register">
				<form>
					<input type="username" name="registerUsername"/>
					<input type="password" name="registerPassword"/>
					<input type="submit" value="Register" onClick={register}/>
				</form>
			</template>
		);

	}

}

class Login extends React.Component {

	render ( ) {

		const login = event => {
			event.preventDefault();
			const username = event.target.loginUsername.value;
			const password = event.target.loginPassword.value;
			Meteor.loginWithPassword(username, password);
		} ;

		return (
			<template name="login">
				<form>
					<input type="username" name="loginUsername"/>
					<input type="password" name="loginPassword"/>
					<input type="submit" value="Login" onClick={login}/>
				</form>
			</template>
		);

	}

}

class Forms extends React.Component {
	constructor ( props ) {
		super(props);
		this.state = {
			form: 'login' ,
		} ;
	}
	render(){
		return this.state.form === 'login' ? <span>login</span> : <span>register</span>;
	}
}

export default class AccountsUI extends React.Component {
	constructor ( props ) {
		super(props);
	}
	render(){
		const { currentUser } = this.props;
		return currentUser ? <Dashboard currentUser={currentUser}/> : <Forms/> ;
	}
}
