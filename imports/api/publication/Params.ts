import {type Subscription} from 'meteor/meteor';
import {type Mongo} from 'meteor/mongo';
import type Authentication from '../Authentication';

type Params<T, U = T> = {
	readonly name: string;
	readonly authentication?: Authentication;
	readonly cursor?: (this: Subscription, ...args: any[]) => Mongo.Cursor<T, U>;
	readonly cursors?: (
		this: Subscription,
		...args: any[]
	) => Array<Mongo.Cursor<T, U>>;
	readonly handle?: (this: Subscription, ...args: any[]) => void;
};

export default Params;
