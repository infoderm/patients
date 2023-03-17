import {chain} from '@iterable-iterator/chain';

import schema from '../../lib/schema';
import {fieldSpecifiers} from './dotNotation';

type Projection<T> = {
	[P in keyof T]?: 0 | 1;
} & {
	score?: {$meta: 'textScore'};
};

export default Projection;

export const projected = schema
	.union([schema.literal(0), schema.literal(1)])
	.optional();

export type Projected = schema.infer<typeof projected>;

export const projection = <S extends schema.ZodTypeAny>(
	type: S,
): schema.ZodType<Projection<schema.infer<S>>> =>
	schema
		.object(
			Object.fromEntries(
				chain(
					(fieldSpecifiers(type) as any).map((key) => [key, projected]),
					[
						[
							'score',
							schema
								.union([
									projected.unwrap(),
									schema.object({$meta: schema.literal('textScore')}),
								])
								.optional(),
						],
					],
				),
			),
		)
		.strict() as any;
