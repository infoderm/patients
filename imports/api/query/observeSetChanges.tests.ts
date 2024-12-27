import {assert} from 'chai';

import {server, waitFor, withMockCollection} from '../../_test/fixtures';

import {
	type Call,
	makeMockedObserver,
	type MockedDocument,
} from './diffSets.tests';
import observeSetChanges from './observeSetChanges';

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

			const handle = await observeSetChanges(documents, {}, {}, observer);

			try {
				expected.push(['added', doc1, {satellite: 'x'}]);
				await assertExpected();

				const doc2 = await documents.insertAsync({satellite: 'z'});
				expected.push(['added', doc2, {satellite: 'z'}]);
				await assertExpected();

				const doc3 = await documents.insertAsync({satellite: 'y'});
				expected.push(['added', doc3, {satellite: 'y'}]);
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
});
