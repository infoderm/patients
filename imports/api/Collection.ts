import {Mongo} from 'meteor/mongo';

import type Document from './Document';

type Collection<T extends Document, U = T> = Mongo.Collection<T, U>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
const Collection = Mongo.Collection;

export default Collection;
