export {MongoInternals} from 'meteor/mongo';

declare module 'meteor/mongo' {
	namespace Mongo {
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface CursorDescription<T> {
			collectionName: string;
			selector: Selector<T>;
			options: Options<T>;
		}
		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Cursor<T, U = T> {
			_cursorDescription: CursorDescription<T>;
			_getCollectionName(): string;
			observeAsync(options: ObserveCallbacks<U>): Promise<ObserveHandle>;
			observeChangesAsync(
				callbacks: ObserveChangesCallbacks<T>,
				options?: {nonMutatingCallbacks?: boolean | undefined},
			): Promise<ObserveHandle>;
		}

		type ObserveHandle = {
			stop(): void;
		};
	}
}
