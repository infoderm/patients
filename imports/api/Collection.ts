import {Mongo} from 'meteor/mongo';

type Collection<T, U = T> = Mongo.Collection<T, U>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
const Collection = Mongo.Collection;

export default Collection;
