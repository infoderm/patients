import {type Mongo} from 'meteor/mongo';

type Options = Pick<
	Mongo.Options<unknown>,
	'fields' | 'sort' | 'skip' | 'limit'
>;

export default Options;
