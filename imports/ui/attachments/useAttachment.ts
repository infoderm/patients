import {Attachments} from '../../api/collection/attachments';
import makeFindOne from '../../api/makeFindOne';

const useAttachment = makeFindOne(Attachments, 'attachment');
export default useAttachment;
