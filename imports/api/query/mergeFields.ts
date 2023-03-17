import type Projection from './Projection';
import {type Sort} from './sort';

/**
 * Merge fields for use with MongoDB.
 */
const mergeFields = <T extends {} = {}>(
	...args: Array<Projection<T> | Sort<T> | undefined>
) => {
	let result: undefined | Projection<T>;
	let sidedness = 0;
	for (const fields of args) {
		if (!fields) continue;
		for (const [key, value] of Object.entries(fields)) {
			if (sidedness === 0) sidedness = value ? 1 : -1;
			if (result === undefined) result = {};
			if (sidedness === 1 && key !== '_id') {
				if (value) {
					result[key] =
						// @ts-expect-error The comparison to -1 is intentional.
						value === -1
							? 1 // TODO This handles directly passing Sort<T>
							: value;
				} else {
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
