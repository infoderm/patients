import {check} from 'meteor/check';
import {Consultations} from '../../collection/consultations';
import define from '../define';

export default define({
	name: 'consultation',
	cursor(_id: string, options) {
		check(_id, String);
		return Consultations.find(
			{
				owner: this.userId,
				_id,
			},
			options,
		);
	},
});
