import {chain} from '@iterable-iterator/chain';

import schema from '../../util/schema';

import {fieldSpecifiers, type FieldSpecifiers} from './dotNotation';
import type WithId from './WithId';

const order = schema.union([schema.literal(-1), schema.literal(1)]).optional();
type Order = schema.infer<typeof order>;

export type Sort<T> = {
	[P in FieldSpecifiers<WithId<T>>]?: Order;
} & {
	score?: {$meta: 'textScore'};
};

const sort = <S extends schema.ZodTypeAny>(
	type: S,
): schema.ZodType<Sort<schema.infer<S>>> =>
	schema
		.object(
			Object.fromEntries(
				chain(
					(fieldSpecifiers(type) as any).map((key) => [key, order]),
					[
						[
							'score',
							schema
								.union([
									order.unwrap(),
									schema.object({$meta: schema.literal('textScore')}),
								])
								.optional(),
						],
					],
				),
			),
		)
		.strict() as any;

export default sort;
