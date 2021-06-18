import {MongoInternals} from 'meteor/mongo';
const db = () => MongoInternals.defaultRemoteCollectionDriver().mongo.db;
export default db;
