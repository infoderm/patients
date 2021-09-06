import {Attachments} from '../../api/collection/attachments';
import makeQuery from '../../api/makeQuery';

const useAttachments = makeQuery(Attachments, 'attachments');
export default useAttachments;
