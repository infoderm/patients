import {type Mongo} from 'meteor/mongo';

const pageQuery = <T, U>(Collection: Mongo.Collection<T, U>) =>
	function (query: Mongo.Selector<T>, options: Mongo.Options<T>) {
		const selector = {...query, owner: this.userId};
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
