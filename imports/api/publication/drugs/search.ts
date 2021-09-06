import {check} from 'meteor/check';
import mergeFields from '../../../util/mergeFields';
import {Drugs} from '../../collection/drugs';
import define from '../define';

export default define({
	name: 'drugs.search',
	cursor(query: string, limit: number) {
		check(query, String);
		check(limit, Number);
		const sort = {score: {$meta: 'textScore'}};
		// mergeFields below is a temporary type hack to
		// hide the fact that score is not 0/1.
		const fields = mergeFields(sort);
		return Drugs.find(
			{$text: {$search: query}},
			{
				fields,
				sort,
				limit,
			},
		);
	},
});
