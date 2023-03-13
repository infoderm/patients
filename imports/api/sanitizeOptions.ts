import type Options from './Options';

const sanitizeOptions = <T>(options?: Options<T>): Options<T> | undefined => {
	if (options === undefined) return undefined;

	const {fields, sort, skip, limit} = options;

	return {
		fields,
		sort,
		skip,
		limit,
	};
};

export default sanitizeOptions;
