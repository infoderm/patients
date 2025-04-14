import assert from 'assert';

import {type GridFilterModel} from '@mui/x-data-grid';

import escapeStringRegexp from 'escape-string-regexp';

import type UserFilter from '../../../api/query/UserFilter';
import {type DocumentDocument} from '../../../api/collection/documents';

export const toUserFilter = ({
	items,
	logicOperator,
}: GridFilterModel): UserFilter<DocumentDocument> | undefined => {
	const op =
		logicOperator === undefined || logicOperator === 'or' ? '$or' : '$and';
	const filters = items.map(_filterModelItem).filter(Boolean);
	return filters.length <= 1
		? filters[0]
		: {
				[op]: filters,
		  };
};

const _filterModelItem = ({
	field,
	operator,
	value,
}: GridFilterModel['items'][number]):
	| UserFilter<DocumentDocument>
	| undefined => {
	switch (operator) {
		case 'isAnyOf': {
			if (value === undefined) return undefined;
			assert(Array.isArray(value));
			return value === undefined ? undefined : {[field]: {$in: value}};
		}

		case 'contains': {
			if (value === undefined) return undefined;
			assert(typeof value === 'string');
			return {[field]: {$regex: escapeStringRegexp(value), $options: 'i'}};
		}

		case 'startsWith': {
			if (value === undefined) return undefined;
			assert(typeof value === 'string');
			return {
				[field]: {$regex: `^${escapeStringRegexp(value)}`, $options: 'i'},
			};
		}

		case 'endsWith': {
			if (value === undefined) return undefined;
			assert(typeof value === 'string');
			return {
				[field]: {$regex: `${escapeStringRegexp(value)}$`, $options: 'i'},
			};
		}

		case 'is':
		case 'equals':
		case '=': {
			if (value === undefined) return undefined;
			return {[field]: value};
		}

		case 'not':
		case '!=': {
			if (value === undefined) return undefined;
			return {[field]: {$ne: value}};
		}

		case '>': {
			if (value === undefined) return undefined;
			assert(typeof value === 'number');
			return {[field]: {$gt: value}};
		}

		case '>=': {
			if (value === undefined) return undefined;
			assert(typeof value === 'number');
			return {[field]: {$gte: value}};
		}

		case '<': {
			if (value === undefined) return undefined;
			assert(typeof value === 'number');
			return {[field]: {$lt: value}};
		}

		case '<=': {
			if (value === undefined) return undefined;
			assert(typeof value === 'number');
			return {[field]: {$lte: value}};
		}

		case 'after': {
			if (value === undefined) return undefined;
			assert(value instanceof Date);
			return {[field]: {$gt: value}};
		}

		case 'onOrAfter': {
			if (value === undefined) return undefined;
			assert(value instanceof Date);
			return {[field]: {$gte: value}};
		}

		case 'before': {
			if (value === undefined) return undefined;
			assert(value instanceof Date);
			return {[field]: {$lt: value}};
		}

		case 'onOrBefore': {
			if (value === undefined) return undefined;
			assert(value instanceof Date);
			return {[field]: {$lte: value}};
		}

		case 'isEmpty': {
			return {
				$or: [{[field]: {$exists: false}}, {[field]: ''}, {[field]: null}],
			};
		}

		case 'isNotEmpty': {
			return {
				$and: [
					{[field]: {$exists: true}},
					{[field]: {$ne: ''}},
					{[field]: {$ne: null}},
				],
			};
		}

		default: {
			throw new Error(`Not implemented: ${operator}(${field}, ${value})`);
		}
	}
};
