import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	type ConsultationDocument,
	Consultations,
} from '../../collection/consultations';
import type Options from '../../Options';
import define from '../define';

export default define({
	name: 'consultation',
	authentication: AuthenticationLoggedIn,
	cursor(_id: string, options?: Options<ConsultationDocument>) {
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
