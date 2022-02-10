import assert from 'assert';
import {cloneElement} from 'react';

const DEFAULT_OPTIONS = {
	unmountDelay: 3000,
	openKey: 'open',
	append(_child: JSX.Element) {
		throw new Error('append not implemented');
	},
	replace(_target: JSX.Element, _replacement: JSX.Element) {
		throw new Error('replace not implemented');
	},
	remove(_child: JSX.Element) {
		throw new Error('remove not implemented');
	},
	key: undefined,
};

export type Options = typeof DEFAULT_OPTIONS;

type Resolve<T> = (value: T | PromiseLike<T>) => void;
type Reject = () => void;

export type ComponentExecutor<T> = (resolve: Resolve<T>, reject: Reject) => any;

const dialog = async <T>(
	componentExecutor: ComponentExecutor<T>,
	options?: Options,
) => {
	const {unmountDelay, openKey, append, replace, remove, key} = {
		...DEFAULT_OPTIONS,
		...options,
	};

	let currentChild: JSX.Element = null;

	const render = (resolve, reject, open) => {
		const target = currentChild;
		currentChild = cloneElement(componentExecutor(resolve, reject), {
			key,
			[openKey]: open,
		});
		if (target === null) {
			append(currentChild);
		} else {
			replace(target, currentChild);
		}
	};

	const unmount = () => {
		assert(currentChild !== null);
		remove(currentChild);
		currentChild = null;
	};

	const promise = new Promise<T>((resolve, reject) => {
		render(resolve, reject, true);
	});

	return promise.finally(() => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const noop = () => {};
		render(noop, noop, false);
		// TODO start timeout after context change
		setTimeout(unmount, unmountDelay);
	});
};

export default dialog;
