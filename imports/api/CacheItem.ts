export default interface CacheItem<T> {
	key: string;
	results: T[];
}
