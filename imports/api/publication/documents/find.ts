import {Documents} from '../../collection/documents';
import pageQuery from '../../pageQuery';
import define from '../define';

export default define({
	name: 'documents',
	cursor: pageQuery(Documents),
});
