import {type Mongo} from 'meteor/mongo';

type Cursor<T, U = T> = Mongo.Cursor<T, U>;

export default Cursor;
