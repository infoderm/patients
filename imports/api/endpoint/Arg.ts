import {type EJSONable, type EJSONableProperty} from 'meteor/ejson';

type Arg = EJSONable | EJSONable[] | EJSONableProperty | EJSONableProperty[];

export default Arg;
