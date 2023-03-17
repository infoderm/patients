import schema from '../../../lib/schema';
import {AuthenticationLoggedIn} from '../../Authentication';
import {
	consultationDocument,
	type ConsultationDocument,
} from '../../collection/consultations';
import {stats} from '../../collection/consultations/stats';
import {setupConsultationsStatsPublication} from '../../consultations';
import type UserFilter from '../../query/UserFilter';
import {userFilter} from '../../query/UserFilter';
import define from '../define';

export default define({
	name: stats,
	authentication: AuthenticationLoggedIn,
	schema: schema.tuple([userFilter(consultationDocument)]),
	handle(filter: UserFilter<ConsultationDocument>) {
		const collection = stats;

		const handle = setupConsultationsStatsPublication.call(
			this,
			collection,
			filter,
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
