import {Patients} from '../../collection/patients';

import define from '../define';

export default define({
	name: 'patients',
	cursor(query, options = undefined) {
		return Patients.find({...query, owner: this.userId}, options);
	},
});
