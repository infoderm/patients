import {AuthenticationLoggedIn} from '../../Authentication';
import pageQuery, {publicationSchema} from '../../query/pageQuery';
import {Attachments, attachmentDocument} from '../../collection/attachments';

import define from '../define';

export default define({
	name: 'attachments',
	authentication: AuthenticationLoggedIn,
	schema: publicationSchema(attachmentDocument),
	cursor: pageQuery(Attachments, ({userId}) => ({userId})),
});
