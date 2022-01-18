import {Mongo} from 'meteor/mongo';

type Collection<T, U = T> = Mongo.Collection<T, U>;
export default Collection;
