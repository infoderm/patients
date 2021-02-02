import {cloneElement} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

const DEFAULT_OPTIONS = {
	unmountDelay: 3000,
	openKey: 'open'
};

const confirm = async (componentExecutor, options) => {
	options = {...DEFAULT_OPTIONS, ...options};

	const container = document.createElement('div');
	document.body.append(container);

	const unmount = () => {
		unmountComponentAtNode(container);
		container.remove();
	};

	const confirmation = new Promise((resolve, reject) => {
		render(
			cloneElement(componentExecutor(resolve, reject), {
				[options.openKey]: true
			}),
			container
		);
	});

	return confirmation.finally(() => {
		const noop = () => {};
		render(
			cloneElement(componentExecutor(noop, noop), {[options.openKey]: false}),
			container,
			() => {
				setTimeout(unmount, options.unmountDelay);
			}
		);
	});
};

export default confirm;
