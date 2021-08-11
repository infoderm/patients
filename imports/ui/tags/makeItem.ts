import {DependencyList} from 'react';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {useTracker} from 'meteor/react-meteor-data';

import TagDocument from '../../api/tags/TagDocument';

interface ReturnType<U> {
	loading: boolean;
	item?: U;
}

const makeItem =
	<T extends TagDocument, U = T>(
		collection: Mongo.Collection<T, U>,
		singlePublication: string,
	) =>
	(name: string, deps: DependencyList): ReturnType<U> =>
		useTracker(() => {
			const handle = Meteor.subscribe(singlePublication, name);
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
