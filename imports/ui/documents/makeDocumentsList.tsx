import assert from 'assert';

import React from 'react';

import {type GridFilterModel, type GridSortModel} from '@mui/x-data-grid';

import escapeStringRegexp from 'escape-string-regexp';

import type PropsOf from '../../util/types/PropsOf';

import {type DocumentDocument} from '../../api/collection/documents';
import type UserFilter from '../../api/query/UserFilter';
import {type Sort} from '../../api/query/sort';
import type GenericQueryHook from '../../api/GenericQueryHook';

import useDataGridModelContextState from '../data-grid/useDataGridModelContextState';

import DataGridModelProvider from '../data-grid/DataGridModelProvider';

import Paginator from '../navigation/Paginator';

import DocumentsTable from './DocumentsTable';

type Props = {
	readonly filter?: UserFilter<DocumentDocument>;
	readonly sort: Sort<DocumentDocument>;

	readonly page?: number;
	readonly perpage?: number;
} & Omit<
	PropsOf<typeof DocumentsTable>,
	'page' | 'pageSize' | 'loading' | 'items' | 'showDeleted'
>;

const makeDocumentsList = (
	useDocuments: GenericQueryHook<DocumentDocument>,
) => {
	const DocumentsList = ({
		filter = {},
		sort,
		page = 1,
		perpage = 10,
		...rest
	}: Props) => {
		const {sortModel, filterModel} = useDataGridModelContextState();

		const query = {
			filter: {
				$and: [filter, _filter(filterModel) ?? {}],
			},
			sort: sortModel.length === 0 ? sort : _sort(sortModel),
			projection: {
				source: 0,
				decoded: 0,
				results: 0,
				text: 0,
			} as const,
			skip: (page - 1) * perpage,
			limit: perpage,
		};

		const deps = [JSON.stringify(query)];
		console.debug({sortModel, filterModel, query});

		const {loading, results: documents} = useDocuments(query, deps);

		return (
			<>
				<DocumentsTable
					loading={Boolean(loading)}
					items={documents}
					page={page - 1}
					pageSize={perpage}
					showDeleted={filter.deleted === undefined}
					{...rest}
				/>
				<Paginator loading={loading} end={documents.length < perpage} />
			</>
		);
	};

	return (props: Props) => (
		<DataGridModelProvider>
			<DocumentsList {...props} />
		</DataGridModelProvider>
	);
};

export default makeDocumentsList;

const _sort = (sortModel: GridSortModel): Sort<DocumentDocument> => {
	assert(sortModel.length === 1);
	return {
		[sortModel[0]!.field]: sortModel[0]!.sort === 'asc' ? 1 : -1,
	} as const;
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

const _filter = ({
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
