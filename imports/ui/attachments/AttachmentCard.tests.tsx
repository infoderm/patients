import React from 'react';

import {faker} from '@faker-js/faker';

import {BrowserRouter} from 'react-router-dom';

import {SnackbarProvider} from 'notistack';

import {client, randomPassword, randomUserId} from '../../_test/fixtures';
import createUserWithPasswordAndLogin from '../../api/user/createUserWithPasswordAndLogin';
import {newUpload} from '../../api/_dev/populate/uploads';

import {Uploads} from '../../api/uploads';
import {render as _render} from '../../_test/react';

import UserThemeProvider from '../UserThemeProvider';

import AttachmentCard from './AttachmentCard';

const render = (children: React.ReactNode) =>
	_render(children, {
		wrapper: ({children}: {children: React.ReactNode}) => (
			<BrowserRouter>
				<UserThemeProvider>
					<SnackbarProvider maxSnack={1} autoHideDuration={null}>
						{children}
					</SnackbarProvider>
				</UserThemeProvider>
			</BrowserRouter>
		),
	});

client(__filename, () => {
	it('should handle loading state', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const attachmentName = faker.string.uuid();

		const attachment = await newUpload(undefined, {name: attachmentName});

		const {findByRole} = render(
			<AttachmentCard loading attachment={attachment} />,
		);

		await findByRole('img', {name: attachmentName});
	});

	it('should display an attached image', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const attachmentName = faker.string.uuid();

		const attachment = await newUpload(undefined, {
			type: 'image/png',
			name: attachmentName,
		});

		const {findByRole} = render(<AttachmentCard attachment={attachment} />);

		await findByRole('img', {name: attachmentName});
	});

	it('should display an attached PDF', async () => {
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const attachmentName = faker.string.uuid();

		const attachment = await newUpload(undefined, {
			type: 'application/pdf',
			name: attachmentName,
		});

		const {findByRole} = render(<AttachmentCard attachment={attachment} />);

		await findByRole('img', {name: attachmentName});
	});

	it('should handle deletion', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const attachmentName = faker.string.uuid();

		const attachment = await newUpload(undefined, {name: attachmentName});

		const {findByRole, findByText} = render(
			<AttachmentCard loading attachment={attachment} />,
		);

		const {user} = setupUser();

		await user.click(
			await findByRole('button', {name: `open menu for ${attachmentName}`}),
		);

		await user.click(await findByRole('menuitem', {name: 'Delete forever'}));

		await user.click(await findByRole('button', {name: 'autofill'}));

		await user.click(await findByRole('button', {name: 'Delete forever'}));

		await findByText('[Trash] File removed from DB and FS');

		await findByRole('img', {name: attachmentName});
	});

	it('should handle deletion validation error', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const attachmentName = faker.string.uuid();

		const attachment = await newUpload(undefined, {name: attachmentName});

		const {findByRole, findByText} = render(
			<AttachmentCard loading attachment={attachment} />,
		);

		const {user} = setupUser();

		await user.click(
			await findByRole('button', {name: `open menu for ${attachmentName}`}),
		);

		await user.click(await findByRole('menuitem', {name: 'Delete forever'}));

		await user.click(await findByRole('button', {name: 'Delete forever'}));

		await findByText('Attachment names do not match');
	});

	it('should handle deletion error', async () => {
		const {setupUser} = await import('../../../test/app/client/fixtures');
		const username = randomUserId();
		const password = randomPassword();
		await createUserWithPasswordAndLogin(username, password);

		const attachmentName = faker.string.uuid();

		const attachment = await newUpload(undefined, {name: attachmentName});

		await Uploads.removeAsync({_id: attachment._id});

		const {findByRole, findByText} = render(
			<AttachmentCard loading attachment={attachment} />,
		);

		const {user} = setupUser();

		await user.click(
			await findByRole('button', {name: `open menu for ${attachmentName}`}),
		);

		await user.click(await findByRole('menuitem', {name: 'Delete forever'}));

		await user.click(await findByRole('button', {name: 'autofill'}));

		await user.click(await findByRole('button', {name: 'Delete forever'}));

		await findByText('[Trash] Error during removal: file already removed');
	});
});
