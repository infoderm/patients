import {cloneElement} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

const DEFAULT_OPTIONS = {
	unmountDelay: 3000,
	openKey: 'open',
	parent: () => document.body,
};

type Options = typeof DEFAULT_OPTIONS;

type Resolve<T> = (value: T | PromiseLike<T>) => void;
type Reject = () => void;

type ComponentExecutor<T> = (resolve: Resolve<T>, reject: Reject) => any;

const dialog = async <T>(
	componentExecutor: ComponentExecutor<T>,
	options?: Options,
) => {
	const {unmountDelay, openKey, parent} = {...DEFAULT_OPTIONS, ...options};

	const container = document.createElement('div');
	parent().append(container);

	const unmount = () => {
		unmountComponentAtNode(container);
		container.remove();
	};

	const promise = new Promise<T>((resolve, reject) => {
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
