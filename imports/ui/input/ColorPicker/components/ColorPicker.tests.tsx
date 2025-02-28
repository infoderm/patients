import React from 'react';

import {client} from '../../../../_test/fixtures';
import {render, waitForElementToBeRemoved} from '../../../../_test/react';

import ColorPicker from './ColorPicker';

client(__filename, () => {
	it('should close picker dialog on {Escape}', async () => {
		const {setupUser} = await import('../../../../../test/app/client/fixtures');
		const {findByRole} = render(
			<ColorPicker
				aria-label="test-label"
				defaultValue="#000"
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				onChange={() => {}}
			/>,
		);

		const button = await findByRole('button', {name: 'test-label'});

		const {user} = setupUser();
		await user.click(button);

		const hex = await findByRole('textbox', {name: 'hex'});

		await Promise.all([
			waitForElementToBeRemoved(hex),
			user.keyboard('{Escape}'),
		]);
	});
});
