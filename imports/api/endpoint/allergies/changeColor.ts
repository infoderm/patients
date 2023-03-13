import {check} from 'meteor/check';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Allergies} from '../../collection/allergies';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'allergies.changeColor',
	authentication: AuthenticationLoggedIn,
	validate(tagId: string, newColor: string) {
		check(tagId, String);
		check(newColor, String);
	},
	transaction: unconditionallyUpdateById(
		Allergies,
		(_db, _existing, newColor: string) => ({
			$set: {color: newColor},
		}),
	),
	simulate(_tagId: string, _newColor: string) {
		return undefined;
	},
});
