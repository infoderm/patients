import {AuthenticationLoggedIn} from '../../Authentication';
import {stats} from '../../collection/consultations/stats';
import {setupConsultationsStatsPublication} from '../../consultations';
import define from '../define';

export default define({
	name: stats,
	authentication: AuthenticationLoggedIn,
	handle(query) {
		const collection = stats;

		const handle = setupConsultationsStatsPublication.call(
			this,
			collection,
			query,
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
