import {faker} from '@faker-js/faker';
import {GridLogicOperator} from '@mui/x-data-grid';
import {assert} from 'chai';

import {client} from '../../../_test/fixtures';

import {toUserFilter} from './convert';

client(__filename, () => {
	it('should work with zero filter items ("or")', () => {
		assert.deepEqual(
			toUserFilter({
				items: [],
				logicOperator: GridLogicOperator.Or,
			}),
			undefined,
		);
	});

	it('should work with zero filter items ("and")', () => {
		assert.deepEqual(
			toUserFilter({
				items: [],
				logicOperator: GridLogicOperator.And,
			}),
			undefined,
		);
	});

	it('should work with zero filter items (default logic operator)', () => {
		assert.deepEqual(
			toUserFilter({
				items: [],
			}),
			undefined,
		);
	});

	it('should work with disabled filter items ("or")', () => {
		assert.deepEqual(
			toUserFilter({
				items: [
					{field: 'x', operator: 'is', value: undefined},
					{field: 'y', operator: '>='},
				],
				logicOperator: GridLogicOperator.Or,
			}),
			undefined,
		);
	});

	it('should work with disabled filter items ("and")', () => {
		assert.deepEqual(
			toUserFilter({
				items: [
					{field: 'x', operator: 'is', value: undefined},
					{field: 'y', operator: '>='},
				],
				logicOperator: GridLogicOperator.And,
			}),
			undefined,
		);
	});

	it('should work with disabled filter items (default logic operator)', () => {
		assert.deepEqual(
			toUserFilter({
				items: [
					{field: 'x', operator: 'is', value: undefined},
					{field: 'y', operator: '>='},
				],
			}),
			undefined,
		);
	});

	it('should work with non-empty filter ("or")', () => {
		const referenceDateAfter = faker.date.anytime();
		const referenceDateOnOrBefore = faker.date.anytime();
		assert.deepEqual(
			toUserFilter({
				items: [
					{field: 'a', operator: 'is', value: 'A'},
					{field: 'b', operator: 'isAnyOf'},
					{field: 'c', operator: 'contains', value: 'C'},
					{field: 'd', operator: 'startsWith', value: undefined},
					{field: 'e', operator: 'endsWith', value: 'E'},
					{field: 'f', operator: 'is'},
					{field: 'g', operator: 'equals', value: 'G'},
					{field: 'h', operator: '=', value: undefined},
					{field: 'i', operator: 'not', value: 'I'},
					{field: 'j', operator: '!='},
					{field: 'k', operator: '>', value: 4},
					{field: 'l', operator: '>=', value: undefined},
					{field: 'm', operator: '<', value: 6},
					{field: 'n', operator: '<='},
					{field: 'o', operator: 'after', value: referenceDateAfter},
					{field: 'p', operator: 'onOrAfter'},
					{field: 'q', operator: 'before', value: undefined},
					{field: 'r', operator: 'onOrBefore', value: referenceDateOnOrBefore},
					{field: 's', operator: 'isEmpty'},
					{field: 't', operator: 'isNotEmpty'},
				],
				logicOperator: GridLogicOperator.Or,
			}),
			{
				$or: [
					{
						a: 'A',
					},
					{
						c: {
							$options: 'i',
							$regex: 'C',
						},
					},
					{
						e: {
							$options: 'i',
							$regex: 'E$',
						},
					},
					{
						g: 'G',
					},
					{
						i: {
							$ne: 'I',
						},
					},
					{
						k: {
							$gt: 4,
						},
					},
					{
						m: {
							$lt: 6,
						},
					},
					{
						o: {
							$gt: referenceDateAfter,
						},
					},
					{
						r: {
							$lte: referenceDateOnOrBefore,
						},
					},
					{
						$or: [
							{
								s: {
									$exists: false,
								},
							},
							{
								s: '',
							},
							{
								s: null,
							},
						],
					},
					{
						$and: [
							{
								t: {
									$exists: true,
								},
							},
							{
								t: {
									$ne: '',
								},
							},
							{
								t: {
									$ne: null,
								},
							},
						],
					},
				],
			},
		);
	});

	it('should work with non-empty filter ("and")', () => {
		const referenceDateOnOrAfter = faker.date.anytime();
		const referenceDateBefore = faker.date.anytime();
		assert.deepEqual(
			toUserFilter({
				items: [
					{field: 'a', operator: 'is'},
					{field: 'b', operator: 'isAnyOf', value: [1, 2, 3]},
					{field: 'c', operator: 'contains', value: undefined},
					{field: 'd', operator: 'startsWith', value: 'D'},
					{field: 'e', operator: 'endsWith'},
					{field: 'f', operator: 'is', value: 'F'},
					{field: 'g', operator: 'equals', value: undefined},
					{field: 'h', operator: '=', value: 'H'},
					{field: 'i', operator: 'not'},
					{field: 'j', operator: '!=', value: 'J'},
					{field: 'k', operator: '>', value: undefined},
					{field: 'l', operator: '>=', value: 5},
					{field: 'm', operator: '<'},
					{field: 'n', operator: '<=', value: 7},
					{field: 'o', operator: 'after', value: undefined},
					{field: 'p', operator: 'onOrAfter', value: referenceDateOnOrAfter},
					{field: 'q', operator: 'before', value: referenceDateBefore},
					{field: 'r', operator: 'onOrBefore'},
					{field: 's', operator: 'isEmpty'},
					{field: 't', operator: 'isNotEmpty'},
				],
				logicOperator: GridLogicOperator.And,
			}),
			{
				$and: [
					{
						b: {
							$in: [1, 2, 3],
						},
					},
					{
						d: {
							$options: 'i',
							$regex: '^D',
						},
					},
					{
						f: 'F',
					},
					{
						h: 'H',
					},
					{
						j: {
							$ne: 'J',
						},
					},
					{
						l: {
							$gte: 5,
						},
					},
					{
						n: {
							$lte: 7,
						},
					},
					{
						p: {
							$gte: referenceDateOnOrAfter,
						},
					},
					{
						q: {
							$lt: referenceDateBefore,
						},
					},
					{
						$or: [
							{
								s: {
									$exists: false,
								},
							},
							{
								s: '',
							},
							{
								s: null,
							},
						],
					},
					{
						$and: [
							{
								t: {
									$exists: true,
								},
							},
							{
								t: {
									$ne: '',
								},
							},
							{
								t: {
									$ne: null,
								},
							},
						],
					},
				],
			},
		);
	});

	it('should work with non-empty filter (default logic operator)', () => {
		assert.deepEqual(
			toUserFilter({
				items: [
					{field: 'd', operator: 'startsWith', value: 'D'},
					{field: 'e', operator: 'endsWith', value: 'E'},
				],
			}),
			{
				$or: [
					{
						d: {
							$options: 'i',
							$regex: '^D',
						},
					},
					{
						e: {
							$options: 'i',
							$regex: 'E$',
						},
					},
				],
			},
		);
	});
});
