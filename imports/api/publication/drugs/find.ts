import {Drugs} from '../../collection/drugs';
import pageQuery from '../../pageQuery';
import define from '../define';

export default define({
	name: 'drugs',
	cursor: pageQuery(Drugs),
});
