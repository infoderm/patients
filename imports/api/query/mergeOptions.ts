import mergeFields from './mergeFields';
import type Options from './Options';
import type Projection from './Projection';

/**
 * Merge options for use with MongoDB.
 */
const mergeOptions = <T>(
	first: Options<T>,
	...rest: Array<Options<T>>
): Options<T> => {
	let result = first;
	for (const options of rest) {
		if (Object.prototype.hasOwnProperty.call(options, 'fields')) {
			const fields = mergeFields(
				result.fields as Projection<T>,
				options.fields as Projection<T>,
			) as Options<T>['fields'] | undefined;
			result = {
				...result,
				...options,
				fields,
			};
		} else {
			result = {
				...result,
				...options,
			};
		}
	}

	return result;
};

export default mergeOptions;
