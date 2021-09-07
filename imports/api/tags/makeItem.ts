import {DependencyList} from 'react';
import {Mongo} from 'meteor/mongo';
import {useTracker} from 'meteor/react-meteor-data';

import subscribe from '../publication/subscribe';
import Publication from '../publication/Publication';
import TagDocument from './TagDocument';

interface ReturnType<U> {
	loading: boolean;
	item?: U;
}

const makeItem =
	<T extends TagDocument, U = T>(
		collection: Mongo.Collection<T, U>,
		singlePublication: Publication,
	) =>
	(name: string, deps: DependencyList): ReturnType<U> =>
		useTracker(() => {
			const handle = subscribe(singlePublication, name);
			if (handle.ready()) {
				const item = collection.findOne({name} as Mongo.Selector<T>);
				return {
					loading: false,
					item,
				};
			}

			return {loading: true};
		}, deps);

export default makeItem;
