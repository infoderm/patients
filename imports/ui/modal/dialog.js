import {cloneElement} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

const DEFAULT_OPTIONS = {
	unmountDelay: 3000,
	openKey: 'open',
	parent: () => document.body,
};

const dialog = (componentExecutor, options) => {
	options = {...DEFAULT_OPTIONS, ...options};

	const container = document.createElement('div');
	options.parent().append(container);

	const unmount = () => {
		unmountComponentAtNode(container);
		container.remove();
	};

	const promise = new Promise((resolve, reject) => {
		render(
			cloneElement(componentExecutor(resolve, reject), {
				[options.openKey]: true,
			}),
			container,
		);
	});

	return promise.finally(() => {
		const noop = () => {};
		render(
			cloneElement(componentExecutor(noop, noop), {[options.openKey]: false}),
			container,
			() => {
				setTimeout(unmount, options.unmountDelay);
			},
		);
	});
};

export default dialog;
