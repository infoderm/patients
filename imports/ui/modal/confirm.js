import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

class Wrap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
			component: props.component,
			componentProps: props.componentProps
		};
	}

	close() {
		this.setState({open: false});
	}

	render() {
		const Component = this.state.component;
		return <Component open={this.state.open} {...this.state.componentProps} />;
	}
}

const deferUnmount = (container) => {
	setTimeout(() => {
		unmountComponentAtNode(container);
		container.remove();
	}, 3000);
};

const confirm = async (componentExecutor) =>
	new Promise((resolve, reject) => {
		const container = document.createElement('div');
		const wrappedResolve = (value) => {
			wrap.close();
			resolve(value);
			deferUnmount(container);
		};

		const wrappedReject = (reason) => {
			wrap.close();
			reject(reason);
			deferUnmount(container);
		};

		document.body.append(container);
		const [Component, props] = componentExecutor(wrappedResolve, wrappedReject);
		const wrap = render(
			<Wrap component={Component} componentProps={props} />,
			container
		);
	});

export default confirm;
