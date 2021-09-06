import {Attachments} from '../../api/collection/attachments';
import makeFindOne from '../../api/makeFindOne';

import publication from '../../api/publication/attachments/attachment';

const useAttachment = makeFindOne(Attachments, publication);
export default useAttachment;
