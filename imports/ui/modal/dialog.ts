import {cloneElement} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

const DEFAULT_OPTIONS = {
	unmountDelay: 3000,
	openKey: 'open',
	parent: () => document.body,
};

type Options = typeof DEFAULT_OPTIONS;

type Resolve = (value: unknown) => void;
type Reject = () => void;

type ComponentExecutor = (resolve: Resolve, reject: Reject) => any;

const dialog = async (
	componentExecutor: ComponentExecutor,
	options?: Options,
) => {
	const {unmountDelay, openKey, parent} = {...DEFAULT_OPTIONS, ...options};

	const container = document.createElement('div');
	parent().append(container);

	const unmount = () => {
		unmountComponentAtNode(container);
		container.remove();
	};

	const promise = new Promise((resolve, reject) => {
		render(
			cloneElement(componentExecutor(resolve, reject), {
				[openKey]: true,
			}),
			container,
		);
	});

	return promise.finally(() => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const noop = () => {};
		render(
			cloneElement(componentExecutor(noop, noop), {[openKey]: false}),
			container,
			() => {
				setTimeout(unmount, unmountDelay);
			},
		);
	});
};

export default dialog;
