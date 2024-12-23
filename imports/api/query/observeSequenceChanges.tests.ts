import {assert} from 'chai';

import {server, waitFor, withMockCollection} from '../../_test/fixtures';

import {
	type Call,
	makeMockedObserver,
	type MockedDocument,
} from './diffSequences.tests';
import observeSequenceChanges from './observeSequenceChanges';

server(__filename, () => {
	it(
		'works',
		withMockCollection<Omit<MockedDocument, '_id'>>(async (documents) => {
			const observer = makeMockedObserver<MockedDocument>();

			const expected: Array<Call<string, MockedDocument>> = [];

			const assertExpected = async () => {
				await waitFor(() => observer.calls.all().length === expected.length);

				assert.deepEqual(observer.calls.all(), expected);
			};

			const doc1 = await documents.insertAsync({satellite: 'x'});
			await assertExpected();

			const handle = await observeSequenceChanges(documents, {}, {}, observer);
			try {
				expected.push(['addedBefore', doc1, null, {satellite: 'x'}]);
				await assertExpected();

				const doc2 = await documents.insertAsync({satellite: 'z'});
				expected.push(['addedBefore', doc2, null, {satellite: 'z'}]);
				await assertExpected();

				const doc3 = await documents.insertAsync({satellite: 'y'});
				expected.push(['addedBefore', doc3, null, {satellite: 'y'}]);
				await assertExpected();

				await documents.removeAsync(doc2);
				expected.push(['removed', doc2]);
				await assertExpected();

				await documents.updateAsync(doc1, {satellite: 'X'});
				expected.push(['changed', doc1, {satellite: 'X'}]);
				await assertExpected();
			} finally {
				await handle.emit('stop', undefined);
			}
		}),
	);

	it(
		'works with sort',
		withMockCollection<Omit<MockedDocument, '_id'>>(async (documents) => {
			const observer = makeMockedObserver<MockedDocument>();

			const expected: Array<Call<string, MockedDocument>> = [];

			const assertExpected = async () => {
				await waitFor(() => observer.calls.all().length === expected.length);

				assert.deepEqual(observer.calls.all(), expected);
			};

			const doc1 = await documents.insertAsync({satellite: 'a'});
			await assertExpected();

			const handle = await observeSequenceChanges(
				documents,
				{},
				{
					sort: {
						satellite: 1,
					},
				},
				observer,
			);

			try {
				expected.push(['addedBefore', doc1, null, {satellite: 'a'}]);
				await assertExpected();

				const doc2 = await documents.insertAsync({satellite: 'c'});
				expected.push(['addedBefore', doc2, null, {satellite: 'c'}]);
				await assertExpected();

				const doc3 = await documents.insertAsync({satellite: 'b'});
				expected.push(['addedBefore', doc3, doc2, {satellite: 'b'}]);
				await assertExpected();

				await documents.removeAsync(doc2);
				expected.push(['removed', doc2]);
				await assertExpected();

				await documents.updateAsync(doc1, {satellite: 'd'});
				expected.push(
					['movedBefore', doc3, doc1],
					['changed', doc1, {satellite: 'd'}],
				);
				await assertExpected();
			} finally {
				await handle.emit('stop', undefined);
			}
		}),
	);
});
