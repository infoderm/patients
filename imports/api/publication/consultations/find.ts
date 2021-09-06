import {Consultations} from '../../collection/consultations';
import define from '../define';

export default define({
	name: 'consultations',
	cursor(query = {}) {
		return Consultations.find({
			isDone: true,
			...query,
			owner: this.userId,
		});
	},
});
