import {assert} from 'chai';

import {isomorphic} from '../_test/fixtures';

import schema, {at, keyof, partial, simplify, toJSON} from './schema';

const _asserInvalidInput = <T>(
	result: schema.SafeParseReturnType<T, T>,
	messages: string[] = ['Invalid input'],
) => {
	assert.isFalse(result.success);
	assert.deepEqual(
		result.error.issues.map(({message}) => message),
		messages,
	);
};

isomorphic(__filename, () => {
	it('`at` should work', () => {
		const expected = schema.string();
		assert.strictEqual(
			at(schema.object({name: expected}), schema.literal('name')),
			expected,
		);
	});

	it('`at` should throw on non-implemented types', () => {
		assert.throws(
			() => at(schema.string(), schema.number()),
			'Not implemented: at(ZodString, ZodNumber)',
		);
	});

	it('`at` should work on intersections', () => {
		const tSchema = at(
			schema.intersection(
				schema.object({count: schema.number()}),
				schema.object({name: schema.string()}),
			),
			schema.literal('name'),
		);

		assert.deepEqual(tSchema.parse('test'), 'test');
	});

	it('`at` should work on unions', () => {
		const tSchema = at(
			schema.union([
				schema.object({count: schema.number()}),
				schema.object({name: schema.string()}),
			]),
			schema.literal('name'),
		);

		assert.deepEqual(tSchema.parse('test'), 'test');
	});

	it('`at` should work on intersections of unions', () => {
		const tSchema = at(
			schema.intersection(
				schema.object({count: schema.number()}),
				schema.union([
					schema.object({name: schema.undefined()}),
					schema.object({name: schema.string()}),
				]),
			),
			schema.literal('name'),
		);

		assert.deepEqual(
			[tSchema.parse('test'), tSchema.parse(undefined)],
			['test', undefined],
		);
	});

	it('`at` should work on intersections of unions (strict)', () => {
		const tSchema = at(
			schema.intersection(
				schema.object({count: schema.number()}).strict(),
				schema.union([
					schema.object({name: schema.undefined()}).strict(),
					schema.object({name: schema.string()}).strict(),
				]),
			),
			schema.literal('name'),
		);

		assert.deepEqual(
			[tSchema.parse('test'), tSchema.parse(undefined)],
			['test', undefined],
		);
	});

	it('`at` should work on intersections of unions (never)', () => {
		const tSchema = at(
			schema.intersection(
				schema.object({name: schema.never()}),
				schema.union([
					schema.object({name: schema.undefined()}),
					schema.object({name: schema.string()}),
				]),
			),
			schema.literal('name'),
		);

		_asserInvalidInput(tSchema.safeParse('test'), [
			'Expected never, received string',
		]);
	});

	it('`keyof` should throw on non-implemented types', () => {
		assert.throws(
			() => keyof(schema.string()),
			'Not implemented: keyof(ZodString)',
		);
	});

	it('`keyof` should work on intersections of unions', () => {
		const tSchema = keyof(
			schema.intersection(
				schema.object({count: schema.number()}),
				schema.union([
					schema.object({name: schema.undefined()}),
					schema.object({name: schema.string()}),
				]),
			),
		);

		assert.deepEqual(JSON.parse(toJSON(simplify(tSchema))), {
			_def: {
				typeName: 'ZodEnum',
				values: ['count', 'name'],
			},
		});
	});

	it('`partial` should throw on non-implemented types', () => {
		assert.throws(
			() => partial(schema.string()),
			'Not implemented: partial(ZodString)',
		);
	});

	it('`partial` should work on objects', () => {
		const tSchema = partial(schema.object({count: schema.number()}));

		assert.deepEqual(JSON.parse(toJSON(simplify(tSchema))), {
			_def: {
				typeName: 'ZodObject',
				catchall: {
					_def: {
						typeName: 'ZodNever',
					},
				},
				unknownKeys: 'strip',
			},
			shape: {
				count: {
					_def: {
						typeName: 'ZodOptional',
						innerType: {
							_def: {
								checks: [],
								coerce: false,
								typeName: 'ZodNumber',
							},
						},
					},
				},
			},
		});
	});

	it('`simplify` branded types', () => {
		const tSchema = simplify(
			schema.union([schema.null(), schema.undefined()]).brand(),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				type: {
					_def: {
						innerType: {
							_def: {
								typeName: 'ZodNull',
							},
						},
						typeName: 'ZodOptional',
					},
				},
				typeName: 'ZodBranded',
			},
		});
	});

	it('`simplify` readonly types', () => {
		const tSchema = simplify(
			schema.union([schema.undefined(), schema.null()]).readonly(),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				innerType: {
					_def: {
						innerType: {
							_def: {
								typeName: 'ZodNull',
							},
						},
						typeName: 'ZodOptional',
					},
				},
				typeName: 'ZodReadonly',
			},
		});
	});

	it('`simplify` union with `any`', () => {
		const tSchema = simplify(schema.union([schema.string(), schema.any()]));

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodAny',
			},
			_any: true,
		});
	});

	it('`simplify` union with `unknown`', () => {
		const tSchema = simplify(schema.union([schema.string(), schema.unknown()]));

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodUnknown',
			},
			_unknown: true,
		});
	});

	it('`simplify` union with `never`', () => {
		const tSchema = simplify(schema.union([schema.string(), schema.never()]));

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				checks: [],
				coerce: false,
				typeName: 'ZodString',
			},
		});
	});

	it('`simplify` unions of `undefined`s and `null`s', () => {
		const tSchema = simplify(
			schema
				.union([
					schema.string().optional(),
					schema.null(),
					schema.undefined(),
					schema.number().nullable(),
				])
				.optional()
				.nullable()
				.optional()
				.nullable(),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				innerType: {
					_def: {
						innerType: {
							_def: {
								options: [
									{
										_def: {
											checks: [],
											coerce: false,
											typeName: 'ZodString',
										},
									},
									{
										_def: {
											checks: [],
											coerce: false,
											typeName: 'ZodNumber',
										},
									},
								],
								typeName: 'ZodUnion',
							},
						},
						typeName: 'ZodNullable',
					},
				},
				typeName: 'ZodOptional',
			},
		});
	});

	it('`simplify` intersection with `any`', () => {
		const tSchema = simplify(
			schema.intersection(schema.string(), schema.any()),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				checks: [],
				coerce: false,
				typeName: 'ZodString',
			},
		});
	});

	it('`simplify` intersection with `unknown`', () => {
		const tSchema = simplify(
			schema.intersection(schema.unknown(), schema.string()),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				checks: [],
				coerce: false,
				typeName: 'ZodString',
			},
		});
	});

	it('`simplify` intersection with `never`', () => {
		const tSchema = simplify(
			schema.intersection(schema.string(), schema.never()),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodNever',
			},
		});
	});

	it('`simplify` intersection(any, never)', () => {
		const tSchema = simplify(schema.intersection(schema.any(), schema.never()));

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodNever',
			},
		});
	});

	it('`simplify` intersection(never, unknown)', () => {
		const tSchema = simplify(
			schema.intersection(schema.never(), schema.unknown()),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodNever',
			},
		});
	});

	it('`simplify` intersection(string, number)', () => {
		const tSchema = simplify(
			schema.intersection(schema.string(), schema.number()),
		);

		// TODO: Should be `never`.
		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				left: {
					_def: {
						checks: [],
						coerce: false,
						typeName: 'ZodString',
					},
				},
				right: {
					_def: {
						checks: [],
						coerce: false,
						typeName: 'ZodNumber',
					},
				},
				typeName: 'ZodIntersection',
			},
		});
	});

	it('`simplify` intersection(union(string, number).optional, number)', () => {
		const tSchema = simplify(
			schema.intersection(
				schema.union([schema.string(), schema.number()]).optional(),
				schema.number(),
			),
		);

		// TODO: Should be `number`.
		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				left: {
					_def: {
						innerType: {
							_def: {
								options: [
									{
										_def: {
											checks: [],
											coerce: false,
											typeName: 'ZodString',
										},
									},
									{
										_def: {
											checks: [],
											coerce: false,
											typeName: 'ZodNumber',
										},
									},
								],
								typeName: 'ZodUnion',
							},
						},
						typeName: 'ZodOptional',
					},
				},
				right: {
					_def: {
						checks: [],
						coerce: false,
						typeName: 'ZodNumber',
					},
				},
				typeName: 'ZodIntersection',
			},
		});
	});

	it('`simplify` deduplicates intersections (string)', () => {
		const tSchema = simplify(
			schema.intersection(schema.string(), schema.string()),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				checks: [],
				coerce: false,
				typeName: 'ZodString',
			},
		});
	});

	it('`simplify` deduplicates intersections (symbol)', () => {
		const tSchema = simplify(
			schema.intersection(schema.symbol(), schema.symbol()),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodSymbol',
			},
		});
	});

	it('`simplify` deduplicates intersections (number)', () => {
		const tSchema = simplify(
			schema.intersection(schema.number(), schema.number()),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				checks: [],
				coerce: false,
				typeName: 'ZodNumber',
			},
		});
	});

	it('`simplify` deduplicates intersections (nan)', () => {
		const tSchema = simplify(schema.intersection(schema.nan(), schema.nan()));

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodNaN',
			},
		});
	});

	it('`simplify` deduplicates intersections (undefined)', () => {
		const tSchema = simplify(
			schema.intersection(schema.undefined(), schema.undefined()),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodUndefined',
			},
		});
	});

	it('`simplify` deduplicates intersections (null)', () => {
		const tSchema = simplify(schema.intersection(schema.null(), schema.null()));

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				typeName: 'ZodNull',
			},
		});
	});

	it('`simplify` deduplicates nested intersections', () => {
		const tSchema = simplify(
			schema.intersection(
				schema.string(),
				schema.intersection(schema.string(), schema.string()),
			),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				checks: [],
				coerce: false,
				typeName: 'ZodString',
			},
		});
	});

	it('`simplify` merges object intersections', () => {
		const tSchema = simplify(
			schema.intersection(
				schema.object({count: schema.number()}),
				schema.object({name: schema.string()}),
			),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				catchall: {
					_def: {
						typeName: 'ZodNever',
					},
				},
				typeName: 'ZodObject',
				unknownKeys: 'strip',
			},
			shape: {
				count: {
					_def: {
						checks: [],
						coerce: false,
						typeName: 'ZodNumber',
					},
				},
				name: {
					_def: {
						checks: [],
						coerce: false,
						typeName: 'ZodString',
					},
				},
			},
		});
	});

	it('`simplify` merges strict object intersections', () => {
		const tSchema = simplify(
			schema.intersection(
				schema.object({count: schema.number()}).strict(),
				schema.object({name: schema.string()}).strict(),
			),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				catchall: {
					_def: {
						typeName: 'ZodNever',
					},
				},
				typeName: 'ZodObject',
				unknownKeys: 'strict',
			},
			shape: {
				count: {
					_def: {
						checks: [],
						coerce: false,
						typeName: 'ZodNumber',
					},
				},
				name: {
					_def: {
						checks: [],
						coerce: false,
						typeName: 'ZodString',
					},
				},
			},
		});
	});

	it('`simplify` merges nested object intersections', () => {
		const tSchema = simplify(
			schema.intersection(
				schema.object({id: schema.symbol()}),
				schema.intersection(
					schema.object({count: schema.number()}),
					schema.object({name: schema.string()}),
				),
			),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				catchall: {
					_def: {
						typeName: 'ZodNever',
					},
				},
				typeName: 'ZodObject',
				unknownKeys: 'strip',
			},
			shape: {
				count: {
					_def: {
						checks: [],
						coerce: false,
						typeName: 'ZodNumber',
					},
				},
				id: {
					_def: {
						typeName: 'ZodSymbol',
					},
				},
				name: {
					_def: {
						checks: [],
						coerce: false,
						typeName: 'ZodString',
					},
				},
			},
		});
	});

	it('`simplify` maps object values', () => {
		const tSchema = simplify(
			schema.object({
				count: schema.union([schema.undefined(), schema.number()]),
			}),
		);

		assert.deepEqual(JSON.parse(toJSON(tSchema)), {
			_def: {
				catchall: {
					_def: {
						typeName: 'ZodNever',
					},
				},
				typeName: 'ZodObject',
				unknownKeys: 'strip',
			},
			shape: {
				count: {
					_def: {
						innerType: {
							_def: {
								checks: [],
								coerce: false,
								typeName: 'ZodNumber',
							},
						},
						typeName: 'ZodOptional',
					},
				},
			},
		});
	});
});
