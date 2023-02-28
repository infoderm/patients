import type Collection from './Collection';
import type CacheItem from './CacheItem';

type ObservedQueryCacheCollection<T> = Collection<CacheItem<T>>;

export default ObservedQueryCacheCollection;
