import {Uploads} from './uploads';

export const link = (attachment) =>
	`/${Uploads.link(attachment).split('/').slice(3).join('/')}`;
