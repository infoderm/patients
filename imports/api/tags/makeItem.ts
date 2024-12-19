import {type DependencyList} from 'react';

import type Collection from '../Collection';
import type Selector from '../query/Selector';

import useSubscription from '../publication/useSubscription';
import useItem from '../publication/useItem';
import type PublicationEndpoint from '../publication/PublicationEndpoint';

import type TagDocument from './TagDocument';

type ReturnType<U> = {
	loading: boolean;
	item?: U;
};

const makeItem =
	<T extends TagDocument, U = T>(
		collection: Collection<T, U>,
		singlePublication: PublicationEndpoint<[string]>,
	) =>
	(name: string, deps: DependencyList): ReturnType<U> => {
		const isLoading = useSubscription(singlePublication, [name]);
		const loadingSubscription = isLoading();

		const {loading: loadingResult, result} = useItem(
			loadingSubscription ? null : collection,
			{name} as Selector<T>,
			undefined,
			[loadingSubscription, ...deps],
		);

		return {
			loading: loadingSubscription || loadingResult,
			item: result,
		};
	};

export default makeItem;
