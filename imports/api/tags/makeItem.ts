import {type DependencyList} from 'react';

import type Collection from '../Collection';
import type Selector from '../query/Selector';

import useSubscription from '../publication/useSubscription';
import useItem from '../publication/useItem';
import type Publication from '../publication/Publication';

import type TagDocument from './TagDocument';

type ReturnType<U> = {
	loading: boolean;
	item?: U;
};

const makeItem =
	<T extends TagDocument, U = T>(
		collection: Collection<T, U>,
		singlePublication: Publication<[string]>,
	) =>
	(name: string, deps: DependencyList): ReturnType<U> => {
		const isLoading = useSubscription(singlePublication, name);
		const loading = isLoading();

		const item = useItem(
			loading ? null : collection,
			{name} as Selector<T>,
			undefined,
			[loading, ...deps],
		);

		return {
			loading,
			item,
		};
	};

export default makeItem;
