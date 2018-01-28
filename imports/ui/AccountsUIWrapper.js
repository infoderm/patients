import React from 'react';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class AccountsUIWrapper extends React.Component {
	componentDidMount() {
		this.view = Blaze.render(Template.loginButtons, this.container);
		this.container = null;
	}
	componentWillUnmount() {
		Blaze.remove(this.view);
	}
	render(){
		return <span ref={node => this.container = node}/>;
	}
}
