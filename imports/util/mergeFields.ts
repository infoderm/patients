/**
 * Merge fields for use with MongoDB.
 */
const mergeFields = (...args: Array<Record<string, any> | undefined>) => {
	let result: undefined | Record<string, any>;
	let sidedness = 0;
	for (const fields of args) {
		if (!fields) continue;
		for (const [key, value] of Object.entries(fields)) {
			if (sidedness === 0) sidedness = value ? 1 : -1;
			if (result === undefined) result = {};
			if (sidedness === 1 && key !== '_id') {
				if (value) result[key] = value;
				else {
					// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
					delete result[key];
				}
			} else if (value) {
				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				delete result[key];
			} else result[key] = 0;
		}
	}

	return result;
};

export default mergeFields;
