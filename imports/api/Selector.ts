import {type Mongo} from 'meteor/mongo';

type Selector<T> = Mongo.Selector<T>;

export default Selector;
