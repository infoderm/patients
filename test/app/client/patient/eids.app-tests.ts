import {fireEvent} from '@testing-library/dom';

import createUserWithPassword from '../../../../imports/api/user/createUserWithPassword';

import {exampleEidXML} from '../../../../imports/api/_dev/populate/eids';

import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/_test/fixtures';
import {setupApp, searchForPatient} from '../fixtures';

type Item = string | File;

const createFileList = (files: File[]): FileList => {
	const list: FileList & Iterable<File> = {
		...files,
		length: files.length,
		item: (index: number) => list[index]!,
		[Symbol.iterator]: () => files[Symbol.iterator](),
	};
	list.constructor = FileList;
	Object.setPrototypeOf(list, FileList.prototype);
	Object.freeze(list);

	return list;
};

const itemToDataTransferItem = (item: Item) =>
	item instanceof File
		? {
				kind: 'file',
				type: item.type,
				getAsFile: () => item,
		  }
		: {
				kind: 'string',
				type: 'text/plain',
				getAsString(resolve: (value: string) => void) {
					resolve(item);
				},
		  };

const createItemList = (items: Item[]): DataTransferItemList => {
	const list: DataTransferItemList & Iterable<DataTransferItem> = {
		...items.map(itemToDataTransferItem),
		length: items.length,
		add() {
			throw new Error('not-implemented');
		},
		remove() {
			throw new Error('not-implemented');
		},
		clear() {
			throw new Error('not-implemented');
		},
		*[Symbol.iterator]() {
			// eslint-disable-next-line unicorn/no-for-loop,@typescript-eslint/prefer-for-of
			for (let i = 0; i < list.length; ++i) {
				yield list[i]!;
			}
		},
	};

	list.constructor = DataTransferItemList;
	Object.setPrototypeOf(list, DataTransferItemList.prototype);
	Object.freeze(list);

	return list;
};

const createDataTransferFromFiles = (items: Item[] = []): DataTransfer => {
	const dt = new DataTransfer();
	Object.defineProperty(dt, 'files', {
		get: () =>
			createFileList(
				items.filter((item: Item): item is File => item instanceof File),
			),
	});
	Object.defineProperty(dt, 'items', {get: () => createItemList(items)});
	return dt;
};

const dropFiles = async ({findByLabelText}, item: Item) => {
	fireEvent.drop(await findByLabelText(/drop contents here/i), {
		dataTransfer: createDataTransferFromFiles([item]),
	});
};

client(__filename, () => {
	it('should allow to open and close eid dialog', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPassword(username, password);

		const {findByRole, findByText, user} = app;

		await dropFiles(app, exampleEidXML());

		await findByRole('heading', {name: 'Select record to work with.'});

		await user.click(await findByRole('button', {name: 'Cancel'}));

		await findByText('Closed eid dialog.');
	});

	it('should allow to create a patient from eid', async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPassword(username, password);

		const {findByRole, user} = app;

		const eidXML = exampleEidXML({name: 'Doe', firstname: 'Jane'});

		await dropFiles(app, eidXML);

		await findByRole('heading', {name: 'Select record to work with.'});

		await user.click(await findByRole('button', {name: 'Add a new patient'}));

		await user.click(await findByRole('button', {name: 'Next (1)'}));

		await user.click(await findByRole('button', {name: 'Next'}));

		await user.click(
			await findByRole('button', {name: 'Create a new patient'}),
		);

		await searchForPatient(app, 'Jane Doe', {
			name: 'Jane Doe',
		});
	});
});
