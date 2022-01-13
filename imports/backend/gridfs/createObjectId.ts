import {ObjectId} from '../mongodb/module';

const createObjectId = (gridFsFileId: string) => new ObjectId(gridFsFileId);
export default createObjectId;
