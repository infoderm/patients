import {type Meteor} from 'meteor/meteor';
import {type EJSONable, type EJSONableProperty} from 'meteor/ejson';

type Options<
	Result extends
		| EJSONable
		| EJSONable[]
		| EJSONableProperty
		| EJSONableProperty[],
> = {
	wait?: boolean | undefined;
	onResultReceived?:
		| ((error: Error | Meteor.Error | undefined, result?: Result) => void)
		| undefined;
	returnStubValue?: boolean | undefined;
	throwStubExceptions?: boolean | undefined;
	noRetry?: boolean | undefined;
};

export default Options;
