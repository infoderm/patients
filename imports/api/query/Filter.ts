import {chain} from '@iterable-iterator/chain';
import {map} from '@iterable-iterator/map';

import schema from '../../util/schema';

import {$expr, $text, condition, type Condition} from './UserFilter';
import type WithId from './WithId';
import {
	fieldSpecifiers,
	type FieldSpecifiers,
	propertyType,
	type PropertyType,
} from './dotNotation';

type RootFilterOperators<TSchema> = {
	$expr?: Record<string, any>;
	$and?: Array<StrictFilter<TSchema>>;
	$nor?: Array<StrictFilter<TSchema>>;
	$or?: Array<StrictFilter<TSchema>>;
	$text?: {
		$search: string;
		$language?: string;
		$caseSensitive?: boolean;
		$diacriticSensitive?: boolean;
	};
	$where?: string | WhereFunction<TSchema>;
};

type WhereFunction<TSchema> = (this: TSchema) => boolean;

type StrictFilter<TSchema> = {
	[P in FieldSpecifiers<WithId<TSchema>>]?: Condition<
		PropertyType<WithId<TSchema>, P>
	>;
} & RootFilterOperators<WithId<TSchema>>;

export default StrictFilter;

export const $where = schema.union([
	schema.string(),
	schema.instanceof(Function),
]);

export const filter = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<StrictFilter<schema.infer<S>>> => {
	const as = schema.lazy(() => schema.array(s));
	const s = schema
		.object(
			Object.fromEntries(
				chain(
					map(
						(key: string) => [
							key,
							condition(propertyType(tSchema, key) as any),
						],
						fieldSpecifiers(tSchema),
					),
					[
						['$and', as],
						['$nor', as],
						['$or', as],
						['$expr', $expr(tSchema)],
						['$text', $text],
						['$where', $where],
					],
				),
			),
		)
		.strict()
		.partial();

	return s;
};
