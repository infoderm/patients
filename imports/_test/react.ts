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
	screen,
	within,
} from '@testing-library/react';
