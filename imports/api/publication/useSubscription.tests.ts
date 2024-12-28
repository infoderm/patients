import {renderHook, waitFor} from '@testing-library/react';

import {assert} from 'chai';

import {client} from '../../_test/fixtures';

import publication from './consultations/find';
import useSubscription from './useSubscription';

client(__filename, () => {
	it('should load immediately on second call', async () => {
		const query = {filter: {}};
		const {result: resultA} = renderHook(() =>
			useSubscription(publication, query),
		);

		assert(resultA.current());

		await waitFor(() => {
			assert(!resultA.current());
		});

		const {result: resultB} = renderHook(() =>
			useSubscription(publication, query),
		);

		assert(!resultB.current());
	});
});
