import {type Mongo} from 'meteor/mongo';

import type Options from './Options';
import sanitizeOptions from './sanitizeOptions';

const pageQuery = <T, U>(Collection: Mongo.Collection<T, U>) =>
	function (query: Mongo.Selector<T>, options: Options) {
		const selector = {...query, owner: this.userId};
		options = sanitizeOptions(options);

		if (options?.skip) {
			const skip = 0;
			const limit = options.limit ? options.skip + options.limit : undefined;
			options = {
				...options,
				skip,
				limit,
			};
		}

		return Collection.find(selector, options);
	};

export default pageQuery;
