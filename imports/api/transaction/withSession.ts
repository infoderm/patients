import {MongoInternals} from 'meteor/mongo';
import {type ClientSession, type ClientSessionOptions} from 'mongodb';

type Callback<R> = (session: ClientSession) => Promise<R>;

const withSession = async <R>(
	callback: Callback<R>,
	sessionOptions?: ClientSessionOptions,
) => {
	const {client} = MongoInternals.defaultRemoteCollectionDriver().mongo;
	// NOTE causalConsistency: true is the default but better be explicit
	// see https://www.youtube.com/watch?v=x5UuQL9rA1c
	const session = client.startSession({
		causalConsistency: true,
		...sessionOptions,
	});
	let result;
	try {
		result = await callback(session);
	} finally {
		// No need to await this Promise, this is just used to free-up
		// resources.
		session.endSession().catch((error) => {
			console.error('Call to endSession failed:', error);
		});
	}

	return result;
};

export default withSession;
