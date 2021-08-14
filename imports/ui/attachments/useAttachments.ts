import {Attachments} from '../../api/attachments';
import makeQuery from '../../api/makeQuery';

const useAttachments = makeQuery(Attachments, 'attachments');
export default useAttachments;
