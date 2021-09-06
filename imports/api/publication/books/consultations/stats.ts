import {check} from 'meteor/check';
import {books} from '../../../books';
import {stats as booksStats} from '../../../collection/books/stats';
import {setupConsultationsStatsPublication} from '../../../consultations';
import define from '../../define';

export default define({
	name: books.options.parentPublicationStats,
	handle(name: string) {
		check(name, String);

		const collection = booksStats;
		const query = books.selector(name);

		const handle = setupConsultationsStatsPublication.call(
			this,
			collection,
			query,
			{name},
		);
		this.ready();

		// Stop observing the cursor when the client unsubscribes. Stopping a
		// subscription automatically takes care of sending the client any `removed`
		// messages.
		this.onStop(() => {
			handle.stop();
		});
	},
});
