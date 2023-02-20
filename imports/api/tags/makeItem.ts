import {type DependencyList} from 'react';
import {type Mongo} from 'meteor/mongo';

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
		Collection: Mongo.Collection<T, U>,
		singlePublication: Publication,
	) =>
	(name: string, deps: DependencyList): ReturnType<U> => {
		const isLoading = useSubscription(singlePublication, name);
		const loading = isLoading();

		const item = useItem(
			loading ? null : Collection,
			{name} as Mongo.Selector<T>,
			undefined,
			deps,
		);

		return {
			loading,
			item,
		};
	};

export default makeItem;
