import {type DependencyList} from 'react';
import {type Mongo} from 'meteor/mongo';

import useSubscription from '../publication/useSubscription';
import useReactive from '../publication/useReactive';
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

		const item = useReactive(
			() =>
				loading ? undefined : Collection.findOne({name} as Mongo.Selector<T>),
			deps,
		);

		return {
			loading,
			item,
		};
	};

export default makeItem;
