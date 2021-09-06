import {Drugs} from '../../collection/drugs';
import define from '../define';

export default define({
	name: 'drugs',
	cursor() {
		return Drugs.find({owner: this.userId});
	},
});
