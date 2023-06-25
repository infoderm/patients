import {type Meteor} from 'meteor/meteor';

import type Serializable from '../Serializable';

type Options<Result extends Serializable> = {
	wait?: boolean | undefined;
	onResultReceived?:
		| ((error: Error | Meteor.Error | undefined, result?: Result) => void)
		| undefined;
	returnStubValue?: boolean | undefined;
	throwStubExceptions?: boolean | undefined;
	noRetry?: boolean | undefined;
};

export default Options;
