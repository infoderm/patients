import type Options from './Options';

const sanitizeOptions = (options: Options): Options => {
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
