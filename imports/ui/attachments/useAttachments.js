import {Attachments} from '../../api/attachments.js';
import makeQuery from '../../api/makeQuery.js';

const useAttachments = makeQuery(Attachments, 'attachments');
export default useAttachments;
