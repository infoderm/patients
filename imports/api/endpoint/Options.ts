import {Meteor} from 'meteor/meteor';
import {EJSONable, EJSONableProperty} from 'meteor/ejson';

interface Options<
	Result extends
		| EJSONable
		| EJSONable[]
		| EJSONableProperty
		| EJSONableProperty[],
> {
	wait?: boolean | undefined;
	onResultReceived?:
		| ((error: Error | Meteor.Error | undefined, result?: Result) => void)
		| undefined;
	returnStubValue?: boolean | undefined;
	throwStubExceptions?: boolean | undefined;
}

export default Options;
