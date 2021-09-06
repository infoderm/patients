import {Attachments} from '../../api/collection/attachments';
import makeQuery from '../../api/makeQuery';

import publication from '../../api/publication/attachments/attachments';

const useAttachments = makeQuery(Attachments, publication);
export default useAttachments;
