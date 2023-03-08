import {type EJSONable, type EJSONableProperty} from 'meteor/ejson';

type Serializable =
	| EJSONable
	| EJSONable[]
	| EJSONableProperty
	| EJSONableProperty[];

export default Serializable;
