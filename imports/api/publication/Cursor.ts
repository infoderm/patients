import {Mongo} from 'meteor/mongo';

type Cursor<T, U = T> = Mongo.Cursor<T, U>;
// eslint-disable-next-line @typescript-eslint/no-redeclare
const Cursor = Mongo.Cursor;

export default Cursor;
