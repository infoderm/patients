import {check} from 'meteor/check';
import {books} from '../../books';
import {Consultations} from '../../collection/consultations';
import define from '../define';

export default define({
	name: books.options.parentPublication,
	cursor(name: string, options = {}) {
		check(name, String);

		const query = {
			...books.selector(name),
			owner: this.userId,
			isDone: true,
		};

		if (options.fields) {
			const {fields, ...rest} = options;
			const _options = {
				...rest,
				fields: {
					...fields,
				},
			};
			for (const key of Object.keys(query)) {
				_options.fields[key] = 1;
			}

			return Consultations.find(query, _options);
		}

		return Consultations.find(query, options);
	},
});
