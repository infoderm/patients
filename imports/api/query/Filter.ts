import {type Condition} from './UserFilter';
import type WithId from './WithId';
import {type FieldSpecifiers, type PropertyType} from './dotNotation';

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
	$where?: string | ((this: TSchema) => boolean);
};

type StrictFilter<TSchema> = {
	[P in FieldSpecifiers<WithId<TSchema>>]?: Condition<
		PropertyType<WithId<TSchema>, P>
	>;
} & RootFilterOperators<WithId<TSchema>>;

export default StrictFilter;
