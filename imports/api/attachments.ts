import {ThumbSizeOptions, Uploads} from './uploads';
import {AttachmentDocument} from './collection/attachments';

export const link = (attachment: AttachmentDocument, version = 'original') =>
	Uploads.link(attachment, version, '/');

export const thumb = (
	attachment: AttachmentDocument,
	{minWidth, minHeight}: ThumbSizeOptions,
) => link(attachment, `${minWidth}x${minHeight}`).replace(/\.pdf$/, '.png');
