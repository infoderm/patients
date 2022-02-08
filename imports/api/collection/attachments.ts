import {FileObj} from 'meteor/ostrio:files';
import {Uploads, MetadataType} from '../uploads';

export const Attachments = Uploads.collection;

export type AttachmentDocument = FileObj<MetadataType>;
