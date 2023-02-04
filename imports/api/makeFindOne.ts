import {type Mongo} from 'meteor/mongo';
import {type DependencyList} from 'react';
import type Publication from './publication/Publication';
import useReactive from './publication/useReactive';
import useSubscription from './publication/useSubscription';

const makeFindOne =
	<T, U>(Collection: Mongo.Collection<T, U>, publication: Publication) =>
	(
		init: Partial<U>,
		query: Mongo.Selector<T> | string,
		options: Mongo.Options<T>,
		deps: DependencyList,
	) => {
		const isLoading = useSubscription(publication, query, options);
		const loading = isLoading();

		const upToDate = useReactive(
			() => (loading ? undefined : Collection.findOne(query, options)),
			[loading, ...deps],
		);

		const found = Boolean(upToDate);

		const fields = {...init, ...upToDate};

		return {loading, found, fields};
	};

export default makeFindOne;
