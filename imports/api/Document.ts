import {type Document as MongoDocument} from 'mongodb';
import schema from '../lib/schema';

type Document = MongoDocument;

export const document = schema.record(schema.string(), schema.any());

export default Document;
