/**
 * Merge fields for use with MongoDB.
 *
 * @param {...Object} args
 * @return {Object}
 */
const mergeFields = (...args) => {
	let result;
	let sidedness = 0;
	for (const fields of args) {
		if (!fields) continue;
		for (const [key, value] of Object.entries(fields)) {
			if (sidedness === 0) sidedness = value ? 1 : -1;
			if (result === undefined) result = {};
			if (sidedness === 1 && key !== '_id') {
				if (value) result[key] = 1;
				else delete result[key];
			} else if (value) delete result[key];
			else result[key] = 0;
		}
	}

	return result;
};

export default mergeFields;
