import type Options from './Options';

const sanitizeOptions = <T>(options: Options<T> | null): Options<T> | null => {
	if (options === null) return null;

	const {fields, sort, skip, limit} = options;

	return {
		fields,
		sort,
		skip,
		limit,
	};
};

export default sanitizeOptions;
