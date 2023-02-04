import {type DependencyList} from 'react';
import {type Mongo} from 'meteor/mongo';

import subscribe from '../publication/subscribe';
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
	(name: string, deps: DependencyList): ReturnType<U> =>
		useReactive(() => {
			const handle = subscribe(singlePublication, name);
			if (handle.ready()) {
				const item = Collection.findOne({name} as Mongo.Selector<T>);
				return {
					loading: false,
					item,
				};
			}

			return {loading: true};
		}, deps);

export default makeItem;
