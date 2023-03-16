import schema from '../lib/schema';
import type Collection from './Collection';
import type Document from './Document';
import type Query from './Query';
import type Selector from './QuerySelector';
import type Options from './QueryOptions';
import sanitizeOptions from './sanitizeOptions';

export const publicationSchema = schema.tuple([
	schema.object({
		/* TODO */
	}),
	schema
		.object({
			/* TODO */
		})
		.nullable(),
]);

const pageQuery = <T extends Document, U = T>(
	collection: Collection<T, U>,
	filter?: Selector<T>,
) =>
	function (selector: Selector<T>, options: Options<T> | null) {
		const query: Query<T> = {selector, options};
		selector = {...query.selector, ...filter, owner: this.userId};
		options = sanitizeOptions(query.options);

		if (options?.skip) {
			const skip = 0;
			const limit = options.limit ? options.skip + options.limit : undefined;
			options = {
				...options,
				skip,
				limit,
			};
		}

		return collection.find(selector, options ?? undefined);
	};

export default pageQuery;
