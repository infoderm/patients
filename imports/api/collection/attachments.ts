import {type FileObj} from 'meteor/ostrio:files';
import {Uploads, type MetadataType} from '../uploads';

export const Attachments = Uploads.collection;

export type AttachmentDocument = FileObj<MetadataType>;
