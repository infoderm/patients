import {GridFSBucket} from '../mongodb/module';
import db from '../mongodb/db';

const createBucket = (options?: object) => new GridFSBucket(db(), options);
export default createBucket;
