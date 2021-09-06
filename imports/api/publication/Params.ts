import {Subscription} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

interface Params<T, U = T> {
	readonly name: string;
	readonly cursor?: (this: Subscription, ...args: any[]) => Mongo.Cursor<T, U>;
	readonly cursors?: (
		this: Subscription,
		...args: any[]
	) => Array<Mongo.Cursor<T, U>>;
	readonly handle?: (this: Subscription, ...args: any[]) => void;
}

export default Params;
