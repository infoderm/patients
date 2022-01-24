import {fireEvent} from '@testing-library/dom';

import {
	client,
	randomPassword,
	randomUserId,
} from '../../../../imports/test/fixtures';
import {
	setupApp,
	createUserWithPasswordAndLogin,
	createNewPatient,
	navigateTo,
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
		add: () => {
			throw new Error('not-implemented');
		},
		remove: () => {
			throw new Error('not-implemented');
		},
		clear: () => {
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

const exampleMedidocReport = `1/88888/77/321
Notissor                Adrien
Rue Jules                          123
1000      Bruxelles
Tel: 12 345 67 89
consultation d'urologie
196910160816
1/77777/66/210
Bachelard               Monilles
#A93031745123
DOE                     JANE
19930317
X
19691016
PZ7654321Y9
O.Ref.: Notissor 19691016 0800



#Rb
!consultation d'urologie
Contact dd: 16/10/1969 08:00 - consultation d'urologie
-----------------------------------------------------------------------



Cher, Chère,


Concerne:
Patiënt: DOE JANE
Date de naissance: 17/03/1993
Adresse:
consultation d'urologie le 16/10/1969


Rapport:


Cordiales salutations,



#R/
#A/
#/
`;

const dropFiles = async ({findByLabelText}, file) => {
	fireEvent.drop(await findByLabelText(/drop contents here/i), {
		dataTransfer: createDataTransferFromFiles([file]),
	});
};

interface MacroExpected {
	[key: string]: any;
	exact?: boolean;
	text: string;
}

interface MacroOptions {
	firstname: string;
	lastname: string;
	contents: string;
	filename: string;
	metadata?: any;
	method: typeof dropFiles;
	expected: MacroExpected[];
}

const macro = (
	title,
	{
		firstname,
		lastname,
		contents,
		filename,
		metadata,
		method,
		expected,
	}: MacroOptions,
) => {
	return it(title, async () => {
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
			await findByRole('link', {name: `${lastname} ${firstname}`}),
		);

		await findByRole('heading', {name: `/patient/${patientId}`});

		await user.click(await findByRole('button', {name: 'documents'}));

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
			contents: exampleMedidocReport,
			filename: 'test.rep',
			method: dropFiles,
			expected: [
				{text: 'PZ7654321Y9'},
				{text: 'Notissor Adrien'},
				{text: 'Cordiales salutations', exact: false},
			],
		},
	);
});
