import schema from '../../../util/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {books} from '../../books';
import {
	type ConsultationDocument,
	Consultations,
	consultationDocument,
} from '../../collection/consultations';
import {options} from '../../query/Options';
import type Options from '../../query/Options';
import define from '../define';

export default define({
	name: books.options.parentPublication,
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([schema.string(), options(consultationDocument)]),
	cursor(name, options: Options<ConsultationDocument> = {}) {
		const query = {
			...books.filter(name),
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
