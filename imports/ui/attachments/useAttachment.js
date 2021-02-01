import {Attachments} from '../../api/attachments.js';
import makeFindOne from '../../api/makeFindOne.js';

const useAttachment = makeFindOne(Attachments, 'upload');
export default useAttachment;
