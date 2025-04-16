import {z as schema, type ZodTypeAny} from 'zod';

type UnionToIntersectionFn<T> = (
	T extends unknown ? (k: () => T) => void : never
) extends (k: infer Intersection) => void
	? Intersection
	: never;

type GetUnionLast<T> = UnionToIntersectionFn<T> extends () => infer Last
	? Last
	: never;

type UnionToIntersection<T, Intersection = any> = T extends never
	? Intersection
	: UnionToIntersection<
			Exclude<T, GetUnionLast<T>>,
			GetUnionLast<T> & Intersection
	  >;

type UnionToTuple<T, Tuple extends unknown[] = []> = [T] extends [never]
	? Tuple
	: UnionToTuple<Exclude<T, GetUnionLast<T>>, [GetUnionLast<T>, ...Tuple]>;

type CastToStringTuple<T> = T extends [string, ...string[]] ? T : never;

export type UnionToTupleString<T> = CastToStringTuple<UnionToTuple<T>>;

export const map = <T extends schema.ZodTypeAny, U extends schema.ZodTypeAny>(
	fn: (x: schema.ZodTypeAny) => schema.ZodTypeAny,
	tSchema: T,
): U => {
	if (tSchema instanceof schema.ZodReadonly) {
		return map(fn, tSchema.unwrap()).readonly() as unknown as U;
	}

	if (tSchema instanceof schema.ZodOptional) {
		return map(
			fn,
			schema.union([tSchema.unwrap(), schema.undefined()]),
		) as unknown as U;
	}

	if (tSchema instanceof schema.ZodNullable) {
		return map(
			fn,
			schema.union([tSchema.unwrap(), schema.null()]),
		) as unknown as U;
	}

	if (tSchema instanceof schema.ZodBranded) {
		return map(fn, tSchema.unwrap()).brand() as unknown as U;
	}

	if (tSchema instanceof schema.ZodUnion) {
		return schema.union(
			tSchema.options.map((x: schema.ZodTypeAny) => map(fn, x)),
		) as unknown as U;
	}

	if (tSchema instanceof schema.ZodIntersection) {
		return schema.intersection(
			map(fn, tSchema._def.left),
			map(fn, tSchema._def.right),
		) as unknown as U;
	}

	return fn(tSchema) as U;
};

export const simplify = <
	T extends schema.ZodTypeAny,
	U extends schema.ZodTypeAny,
>(
	tSchema: T,
): U => {
	if (tSchema instanceof schema.ZodReadonly) {
		return simplify(tSchema.unwrap()).readonly() as unknown as U;
	}

	if (tSchema instanceof schema.ZodOptional) {
		return simplify(
			schema.union([tSchema.unwrap(), schema.undefined()]),
		) as unknown as U;
	}

	if (tSchema instanceof schema.ZodNullable) {
		return simplify(
			schema.union([tSchema.unwrap(), schema.null()]),
		) as unknown as U;
	}

	if (tSchema instanceof schema.ZodBranded) {
		return simplify(tSchema.unwrap()).brand() as unknown as U;
	}

	if (tSchema instanceof schema.ZodObject) {
		return tSchema.extend(
			Object.fromEntries(
				Object.entries(tSchema.shape).map(([key, value]) => [
					key,
					simplify(value as schema.ZodTypeAny),
				]),
			),
		) as unknown as U;
	}

	if (tSchema instanceof schema.ZodUnion) {
		let options = tSchema.options.map(simplify).map((x: schema.ZodTypeAny) => {
			const alternatives: schema.ZodTypeAny[] = [];
			if (x instanceof schema.ZodOptional) {
				alternatives.push(schema.undefined());
				x = x.unwrap();
			}

			if (x instanceof schema.ZodNullable) {
				alternatives.push(schema.null());
				x = x.unwrap();
			}

			return alternatives.length === 0
				? x
				: schema.union([x, alternatives[0]!, ...alternatives.slice(1)]);
		});
		if (options.length === 0) return schema.never() as unknown as U;
		if (options.length === 1) return options[0];
		const unions = options.filter(
			(x: schema.ZodTypeAny) => x instanceof schema.ZodUnion,
		);
		const nonUnion = options.filter(
			(x: schema.ZodTypeAny) => !(x instanceof schema.ZodUnion),
		);
		if (unions.length > 0) {
			options = [].concat(
				nonUnion,
				...unions.map((u: schema.ZodUnion<any>) => u.options),
			);
		}

		options = options.filter(
			(x: schema.ZodTypeAny) => !(x instanceof schema.ZodNever),
		);

		if (options.length === 0) return schema.never() as unknown as U;
		if (options.length === 1) return options[0];

		if (options.some((x: schema.ZodTypeAny) => x instanceof schema.ZodAny)) {
			return schema.any() as unknown as U;
		}

		if (
			options.some((x: schema.ZodTypeAny) => x instanceof schema.ZodUnknown)
		) {
			return schema.unknown() as unknown as U;
		}

		const nonUndefined = options.filter(
			(x: schema.ZodTypeAny) => !(x instanceof schema.ZodUndefined),
		);
		const optional = nonUndefined.length !== options.length;
		options = nonUndefined;

		if (options.length === 0)
			return (optional ? schema.undefined() : schema.never()) as unknown as U;
		if (options.length === 1) return nonUndefined[0].optional() as unknown as U;

		const nonNull = options.filter(
			(x: schema.ZodTypeAny) => !(x instanceof schema.ZodNull),
		);
		const nullable = nonNull.length !== options.length;
		options = nonNull;

		if (options.length === 0)
			return (optional
				? nullable
					? schema.null().optional()
					: schema.undefined()
				: nullable
				? schema.null()
				: schema.never()) as unknown as U;

		let union = options.length === 1 ? options[0] : schema.union(options);
		if (nullable) union = union.nullable();
		if (optional) union = union.optional();
		return union as unknown as U;
	}

	if (tSchema instanceof schema.ZodIntersection) {
		const {left, right} = tSchema._def;
		const _left = simplify(left);
		const _right = simplify(right);

		if (_left instanceof schema.ZodNever) return _left as unknown as U;
		if (_right instanceof schema.ZodNever) return _right as unknown as U;
		if (_left instanceof schema.ZodAny || _left instanceof schema.ZodUnknown)
			return _right as unknown as U;
		if (_right instanceof schema.ZodAny || _right instanceof schema.ZodUnknown)
			return _left as unknown as U;
		if (
			_left instanceof schema.ZodUndefined &&
			_right instanceof schema.ZodUndefined
		)
			return _left as unknown as U;
		if (_left instanceof schema.ZodNull && _right instanceof schema.ZodNull)
			return _left as unknown as U;
		if (_left instanceof schema.ZodNumber && _right instanceof schema.ZodNumber)
			return _left as unknown as U;
		if (_left instanceof schema.ZodNaN && _right instanceof schema.ZodNaN)
			return _left as unknown as U;
		if (_left instanceof schema.ZodString && _right instanceof schema.ZodString)
			return _left as unknown as U;
		if (_left instanceof schema.ZodSymbol && _right instanceof schema.ZodSymbol)
			return _left as unknown as U;
		if (
			_left instanceof schema.ZodObject &&
			_right instanceof schema.ZodObject
		) {
			return _left.merge(_right) as unknown as U;
		}

		return schema.intersection(_left, _right) as unknown as U;
	}

	return tSchema as unknown as U;
};

const _replacer = (_key: string, node: unknown) => {
	if (node instanceof schema.ZodObject) {
		const {
			_def: {typeName, ...rest1},
			shape,
		} = node;
		return {
			_def: {
				typeName,
				...rest1,
			},
			shape,
		};
	}

	if (node instanceof schema.ZodType) {
		const {
			_def: {typeName, ...rest1},
			...rest2
		} = node;
		return {
			_def: {
				typeName,
				...rest1,
			},
			...rest2,
		};
	}

	return node;
};

export const toJSON = <T extends schema.ZodTypeAny>(tSchema: T): string => {
	return JSON.stringify(tSchema, _replacer, 2);
};

type AtKeyOf<T extends schema.ZodTypeAny> = T extends schema.ZodUnion<infer U>
	? keyof UnionToIntersection<U>
	: keyof schema.infer<T>;

export const keyof = <T extends schema.ZodTypeAny>(
	tSchema: T,
): schema.ZodEnum<UnionToTupleString<AtKeyOf<T>>> => {
	if (tSchema instanceof schema.ZodOptional) {
		tSchema = tSchema.unwrap();
	}

	if (tSchema instanceof schema.ZodObject) {
		return tSchema.keyof() as any;
	}

	if (tSchema instanceof schema.ZodRecord) {
		return tSchema.keySchema;
	}

	if (tSchema instanceof schema.ZodUnion) {
		const merged = new Set<string>();
		for (const options of tSchema.options.map((item) => keyof(item).options)) {
			for (const option of options) {
				merged.add(option);
			}
		}

		return schema.ZodEnum.create([...merged] as [string, ...string[]]) as any;
	}

	if (tSchema instanceof schema.ZodIntersection) {
		const merged = new Set<string>();
		for (const options of [tSchema._def.left, tSchema._def.right].map(
			(item) => keyof(item).options as any,
		)) {
			for (const option of options) {
				merged.add(option);
			}
		}

		return schema.ZodEnum.create([...merged] as [string, ...string[]]) as any;
	}

	console.debug({tSchema});
	throw new Error(`Not implemented: keyof(${tSchema._def.typeName})`);
};

export const at = <
	T extends schema.ZodTypeAny,
	K extends schema.ZodType<AtKeyOf<T>>,
>(
	tSchema: T,
	key: K,
): schema.ZodType<schema.infer<T>[schema.infer<K>]> => {
	if (tSchema instanceof schema.ZodOptional) {
		return schema.union([
			at(tSchema.unwrap(), key),
			at(schema.undefined(), schema.never()),
		]);
	}

	if (tSchema instanceof schema.ZodAny) {
		return tSchema;
	}

	if (tSchema instanceof schema.ZodNever) {
		return tSchema;
	}

	if (tSchema instanceof schema.ZodUndefined) {
		return schema.never();
	}

	if (tSchema instanceof schema.ZodObject) {
		if (key instanceof schema.ZodLiteral) {
			return (
				tSchema.shape[key.value] ??
				(tSchema._def.catchAll instanceof schema.ZodNever &&
				tSchema._def.unknownKeys === 'strict'
					? schema.never()
					: schema.any())
			);
		}

		if (key instanceof schema.ZodString) {
			return schema.union(
				Object.values(tSchema.shape) as [
					ZodTypeAny,
					ZodTypeAny,
					...ZodTypeAny[],
				],
			);
		}
	} else if (tSchema instanceof schema.ZodRecord) {
		if (key instanceof schema.ZodLiteral) {
			try {
				tSchema.keySchema.parse(key.value);
				return tSchema.valueSchema;
			} catch {}
		} else if (
			key instanceof schema.ZodString &&
			tSchema.keySchema instanceof schema.ZodString
		) {
			return tSchema.valueSchema;
		}
	} else if (tSchema instanceof schema.ZodUnion) {
		return schema.union(tSchema.options.map((item) => at(item, key)));
	} else if (tSchema instanceof schema.ZodIntersection) {
		return schema.intersection(
			at(tSchema._def.left, key),
			at(tSchema._def.right, key),
		);
	}

	console.debug({key, tSchema});
	throw new Error(
		// @ts-expect-error - NOTE: Typing is incorrect.
		`Not implemented: at(${tSchema._def.typeName}, ${key._def.typeName})`,
	);
};

export const partial = <T extends schema.ZodTypeAny>(
	tSchema: T,
): schema.ZodType<Partial<schema.infer<T>>> => {
	return map(_partial, tSchema);
};

const _partial = <T extends schema.ZodTypeAny>(
	tSchema: T,
): schema.ZodType<Partial<schema.infer<T>>> => {
	if (tSchema instanceof schema.ZodNever) {
		return tSchema;
	}

	if (tSchema instanceof schema.ZodOptional) {
		return partial(tSchema.unwrap()).optional() as any;
	}

	if (tSchema instanceof schema.ZodUndefined) {
		return tSchema;
	}

	if (tSchema instanceof schema.ZodObject) {
		return tSchema.partial();
	}

	if (tSchema instanceof schema.ZodRecord) {
		return tSchema;
	}

	console.debug({tSchema});
	throw new Error(`Not implemented: partial(${tSchema._def.typeName})`);
};

export {z as default} from 'zod';
