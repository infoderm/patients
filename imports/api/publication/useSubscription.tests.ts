import {renderHook, waitFor} from '@testing-library/react';
import {client} from '../../_test/fixtures';
import publication from './consultations/find';
import useSubscription from './useSubscription';
import {assert} from 'chai';

client(__filename, () => {
	it('should load immediately on second call', async () => {
		const query = {filter: {}};
		const {result: resultA} = renderHook(() => useSubscription(publication, query));

		assert(resultA.current());

		await waitFor(() => {
			assert(!resultA.current());
		});

		const {result: resultB} = renderHook(() => useSubscription(publication, query));

		assert(!resultB.current());
	})
})
