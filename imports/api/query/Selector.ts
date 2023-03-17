import {type Mongo} from 'meteor/mongo';

/**
 * @deprecated Use queryToSelectorOptionsPair instead.
 */
type Selector<T> = Mongo.Selector<T>;

export default Selector;
