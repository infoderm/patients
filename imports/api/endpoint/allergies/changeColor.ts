import {check} from 'meteor/check';

import {Allergies} from '../../collection/allergies';
import unconditionallyUpdateById from '../../unconditionallyUpdateById';

import define from '../define';

export default define({
	name: 'allergies.changeColor',
	validate(tagId: string, newColor: string) {
		check(tagId, String);
		check(newColor, String);
	},
	run: unconditionallyUpdateById(Allergies, (_existing, newColor: string) => ({
		$set: {color: newColor},
	})),
});
