import {configure as configureReact} from '@testing-library/react';

configureReact({
	reactStrictMode: true,
});

export {
	render,
	renderHook,
	waitFor,
	waitForElementToBeRemoved,
	cleanup as unmount,
} from '@testing-library/react';
