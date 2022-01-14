import React from 'react';
import {render} from '@testing-library/react';
import {assert} from 'chai';

import {client} from '../test/fixtures';
import App from './App';

const renderApp = () => render(<App />);

client(__filename, () => {
	it('should render', () => {
		const {getByRole} = renderApp();
		getByRole('heading', {name: 'Loading...'});
		assert(true);
	});

	it('should load', async () => {
		const {findByRole} = renderApp();
		await findByRole('heading', {name: 'Please sign in'});
		assert(true);
	});
});
