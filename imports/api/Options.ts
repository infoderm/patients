import {type Mongo} from 'meteor/mongo';

type Options<T> = Pick<Mongo.Options<T>, 'fields' | 'sort' | 'skip' | 'limit'>;

export default Options;
