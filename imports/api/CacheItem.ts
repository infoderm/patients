import schema from '../util/schema';

type CacheItem<R> = {
	key: string;
	results: R[];
};

export default CacheItem;

export const cacheItem = <S extends schema.ZodTypeAny>(
	tSchema: S,
): schema.ZodType<CacheItem<schema.infer<S>>> =>
	schema.object({
		key: schema.string(),
		results: schema.array(tSchema),
	});
