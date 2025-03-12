import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';

import {Allergies} from '../../collection/allergies';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'allergies.changeColor',
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), schema.string()]),
	transaction: unconditionallyUpdateById(
		Allergies,
		(_db, _existing, newColor: string) => ({
			$set: {color: newColor},
		}),
	),
	simulate(_tagId, _newColor) {
		return undefined;
	},
});
