import {ObjectID} from '../mongodb/module';

const createObjectID = (gridFsFileId) => new ObjectID(gridFsFileId);
export default createObjectID;
