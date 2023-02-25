import {fireEvent} from '@testing-library/dom';
import {type Test, type AsyncFunc} from 'mocha';
import {
	exampleHealthoneLab,
	exampleHealthoneReport,
	exampleMedidocReport,
} from '../../../../imports/api/_dev/populate/documents';

import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/_test/fixtures';
import {
	setupApp,
	createUserWithPasswordAndLogin,
	createNewPatient,
	navigateTo,
	uploadFile,
} from '../fixtures';

const createFileList = (files: File[]): FileList => {
	const list: FileList & Iterable<File> = {
		...files,
		length: files.length,
		item: (index: number) => list[index],
		[Symbol.iterator]: () => files[Symbol.iterator](),
	};
	list.constructor = FileList;
	Object.setPrototypeOf(list, FileList.prototype);
	Object.freeze(list);

	return list;
};

const fileToItem = (file) => ({
	kind: 'file',
	type: file.type,
	getAsFile: () => file,
});

const createItemList = (files: File[]): DataTransferItemList => {
	const list: DataTransferItemList & Iterable<DataTransferItem> = {
		...files.map(fileToItem),
		length: files.length,
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
				yield list[i];
			}
		},
	};

	list.constructor = DataTransferItemList;
	Object.setPrototypeOf(list, DataTransferItemList.prototype);
	Object.freeze(list);

	return list;
};

const createDataTransferFromFiles = (files: File[] = []): DataTransfer => {
	const dt = new DataTransfer();
	Object.defineProperty(dt, 'files', {get: () => createFileList(files)});
	Object.defineProperty(dt, 'items', {get: () => createItemList(files)});
	return dt;
};

const dropFiles = async ({findByLabelText}, file) => {
	fireEvent.drop(await findByLabelText(/drop contents here/i), {
		dataTransfer: createDataTransferFromFiles([file]),
	});
};

const selectFiles = async ({findByLabelText}, file) => {
	const button = await findByLabelText('Import Document');
	uploadFile(button, file);
};

type MacroExpected = {
	[key: string]: any;
	exact?: boolean;
	text: string;
};

type MacroOptions = {
	firstname: string;
	lastname: string;
	contents: string;
	filename: string;
	metadata?: any;
	method: typeof dropFiles;
	expected: MacroExpected[];
};

type TestFunction = (title: string, fn: AsyncFunc) => Test;

const macro = (
	title: string,
	{
		firstname,
		lastname,
		contents,
		filename,
		metadata,
		method,
		expected,
	}: MacroOptions,
	test: TestFunction = it,
) => {
	return test(title, async () => {
		const username = randomUserId();
		const password = randomPassword();
		const app = setupApp();
		await createUserWithPasswordAndLogin(app, username, password);

		const patientId = await createNewPatient(app, {
			firstname,
			lastname,
		});

		const {findByRole, findByText, user} = app;

		await navigateTo(app, 'Documents', '/documents');

		await findByRole('heading', {name: 'Nothing to see on page 1.'});

		const file = new File([contents], filename, metadata);

		await method(app, file);

		await findByRole('heading', {name: '/documents'});

		await user.click(
			await findByRole(
				'link',
				{name: `${lastname} ${firstname}`},
				{timeout: 3000},
			),
		);

		await findByRole(
			'heading',
			{name: `/patient/${patientId}`},
			{timeout: 3000},
		);

		await user.click(await findByRole('link', {name: 'documents'}));

		for (const {text, ...options} of expected) {
			// eslint-disable-next-line no-await-in-loop
			await findByText(text, options);
		}
	});
};

client(__filename, () => {
	macro(
		'should allow to attach documents to a patient by drag-and-drop (medidoc report)',
		{
			firstname: 'Jane',
			lastname: 'Doe',
			contents: exampleMedidocReport.contents,
			filename: 'test.rep',
			method: dropFiles,
			expected: [
				{text: 'PZ7654321Y9'},
				{text: 'Notissor Adrien'},
				{text: 'Cordiales salutations', exact: false},
			],
		},
	);
	macro(
		'should allow to attach documents to a patient by import button (medidoc report)',
		{
			firstname: 'Jane',
			lastname: 'Doe',
			contents: exampleMedidocReport.contents,
			filename: 'test.REP',
			method: selectFiles,
			expected: [
				{text: 'PZ7654321Y9'},
				{text: 'Notissor Adrien'},
				{text: 'Cordiales salutations', exact: false},
			],
		},
	);
	macro(
		'should allow to attach documents to a patient by drag-and-drop (healthone report)',
		{
			firstname: 'Jane',
			lastname: 'Doe',
			contents: exampleHealthoneReport.contents,
			filename: 'test.xyz',
			method: dropFiles,
			expected: [
				{text: '4848-06755'},
				{text: 'Mann and Sons'},
				{text: 'CELLULES NAEVIQUES', exact: false},
			],
		},
	);
	macro(
		'should allow to attach documents to a patient by import button (healthone report)',
		{
			firstname: 'Jane',
			lastname: 'Doe',
			contents: exampleHealthoneReport.contents,
			filename: 'test.txt',
			method: selectFiles,
			expected: [
				{text: '4848-06755'},
				{text: 'Mann and Sons'},
				{text: 'CELLULES NAEVIQUES', exact: false},
			],
		},
	);
	macro(
		'should allow to attach documents to a patient by drag-and-drop (healthone lab)',
		{
			firstname: 'Jane',
			lastname: 'Doe',
			contents: exampleHealthoneLab.contents,
			filename: 'test.abc',
			method: dropFiles,
			expected: [
				{text: '0536-36930'},
				{text: 'Harris, Gulgowski and Donnelly'},
				{text: 'Validation biologique informatique', exact: false},
			],
		},
	);
	macro(
		'should allow to attach documents to a patient by import button (healthone lab)',
		{
			firstname: 'Jane',
			lastname: 'Doe',
			contents: exampleHealthoneLab.contents,
			filename: 'test.bsv',
			method: selectFiles,
			expected: [
				{text: '0536-36930'},
				{text: 'Harris, Gulgowski and Donnelly'},
				{text: 'Validation biologique informatique', exact: false},
			],
		},
	);
});
