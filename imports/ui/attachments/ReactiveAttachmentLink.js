import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import {Attachments} from '../../api/attachments.js';

import StaticAttachmentLink from './StaticAttachmentLink.js';

const ReactiveAttachmentLink = withTracker(({attachmentId}) => {
	const _id = attachmentId;
	const handle = Meteor.subscribe('attachment', _id);
	if (handle.ready()) {
		const attachment = Attachments.findOne(_id);
		return {loading: false, attachment};
	}

	return {loading: true};
})(StaticAttachmentLink);

export default ReactiveAttachmentLink;
