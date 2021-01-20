import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import {Uploads} from '../../api/uploads.js';

import StaticAttachmentLink from './StaticAttachmentLink.js';

const ReactiveAttachmentLink = withTracker(({attachmentId}) => {
	const _id = attachmentId;
	const handle = Meteor.subscribe('upload', _id);
	if (handle.ready()) {
		const attachment = Uploads.findOne(_id);
		return {loading: false, attachment};
	}

	return {loading: true};
})(StaticAttachmentLink);

export default ReactiveAttachmentLink;
