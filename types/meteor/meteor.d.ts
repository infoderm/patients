import {type Meteor} from 'meteor/meteor';
import {type Tracker} from 'meteor/tracker';

declare module 'meteor/meteor' {
	namespace Meteor {
		const connection: Connection;

		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface InternalSubscriptionHandle {
			id: string;
			name: string;
			params: any;
			inactive: boolean;
			ready: boolean;
			readyDeps: Tracker.Dependency;
			readyCallback: () => void;
			errorCallback: (error: Error) => void;
			stopCallback: () => void;
			connection: Connection;
			remove: () => void;
			stop: () => void;
		}

		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface SubscriptionHandle {
			subscriptionId: string;
		}

		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Connection {
			_subscriptions: Record<string, InternalSubscriptionHandle>;
		}
	}
}
