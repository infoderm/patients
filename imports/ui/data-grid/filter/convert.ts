import assert from 'assert';

import {GridLogicOperator, type GridFilterModel} from '@mui/x-data-grid';

import escapeStringRegexp from 'escape-string-regexp';

import type UserFilter from '../../../api/query/UserFilter';
import type Document from '../../../api/Document';

export const toUserFilter = <T extends Document>({
	items,
	logicOperator,
}: GridFilterModel): UserFilter<T> | undefined => {
	const op =
		logicOperator === undefined || logicOperator === GridLogicOperator.Or
			? '$or'
			: '$and';
	const filters = items.map(_filterModelItem).filter(Boolean);

	if (filters.length <= 1) return filters[0] as UserFilter<T> | undefined;

	return {
		[op]: filters,
	} as UserFilter<T>;
};

const _filterModelItem = <T extends Document>({
	field,
	operator,
	value,
}: GridFilterModel['items'][number]): UserFilter<T> | undefined => {
	switch (operator) {
		case 'isAnyOf': {
			if (value === undefined) return undefined;
			assert(Array.isArray(value));
			return value === undefined
				? undefined
				: ({[field]: {$in: value}} as UserFilter<T>);
		}

		case 'contains': {
			if (value === undefined) return undefined;
			assert(typeof value === 'string');
			return {
				[field]: {$regex: escapeStringRegexp(value), $options: 'i'},
			} as UserFilter<T>;
		}

		case 'startsWith': {
			if (value === undefined) return undefined;
			assert(typeof value === 'string');
			return {
				[field]: {$regex: `^${escapeStringRegexp(value)}`, $options: 'i'},
			} as UserFilter<T>;
		}

		case 'endsWith': {
			if (value === undefined) return undefined;
			assert(typeof value === 'string');
			return {
				[field]: {$regex: `${escapeStringRegexp(value)}$`, $options: 'i'},
			} as UserFilter<T>;
		}

		case 'is':
		case 'equals':
		case '=': {
			if (value === undefined) return undefined;
			return {[field]: value} as UserFilter<T>;
		}

		case 'not':
		case '!=': {
			if (value === undefined) return undefined;
			return {[field]: {$ne: value}} as UserFilter<T>;
		}

		case '>': {
			if (value === undefined) return undefined;
			assert(typeof value === 'number');
			return {[field]: {$gt: value}} as UserFilter<T>;
		}

		case '>=': {
			if (value === undefined) return undefined;
			assert(typeof value === 'number');
			return {[field]: {$gte: value}} as UserFilter<T>;
		}

		case '<': {
			if (value === undefined) return undefined;
			assert(typeof value === 'number');
			return {[field]: {$lt: value}} as UserFilter<T>;
		}

		case '<=': {
			if (value === undefined) return undefined;
			assert(typeof value === 'number');
			return {[field]: {$lte: value}} as UserFilter<T>;
		}

		case 'after': {
			if (value === undefined) return undefined;
			assert(value instanceof Date);
			return {[field]: {$gt: value}} as UserFilter<T>;
		}

		case 'onOrAfter': {
			if (value === undefined) return undefined;
			assert(value instanceof Date);
			return {[field]: {$gte: value}} as UserFilter<T>;
		}

		case 'before': {
			if (value === undefined) return undefined;
			assert(value instanceof Date);
			return {[field]: {$lt: value}} as UserFilter<T>;
		}

		case 'onOrBefore': {
			if (value === undefined) return undefined;
			assert(value instanceof Date);
			return {[field]: {$lte: value}} as UserFilter<T>;
		}

		case 'isEmpty': {
			return {
				$or: [{[field]: {$exists: false}}, {[field]: ''}, {[field]: null}],
			} as UserFilter<T>;
		}

		case 'isNotEmpty': {
			return {
				$and: [
					{[field]: {$exists: true}},
					{[field]: {$ne: ''}},
					{[field]: {$ne: null}},
				],
			} as UserFilter<T>;
		}

		default: {
			throw new Error(`Not implemented: ${operator}(${field}, ${value})`);
		}
	}
};
