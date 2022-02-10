import mergeFields from './mergeFields';

/**
 * Merge options for use with MongoDB.
 *
 * @param {Object} first
 * @param {...Object} rest
 * @return {Object}
 */
const mergeOptions = (first, ...rest) => {
	let result = first;
	for (const options of rest) {
		if (Object.prototype.hasOwnProperty.call(options, 'fields')) {
			const fields = mergeFields(result.fields, options.fields);
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
