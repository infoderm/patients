import {configure as configureReact} from '@testing-library/react';

configureReact({
	reactStrictMode: false,
});

export {
	render,
	renderHook,
	waitFor,
	waitForElementToBeRemoved,
	cleanup as unmount,
} from '@testing-library/react';
