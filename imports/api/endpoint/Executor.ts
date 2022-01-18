// import {EJSONable, EJSONableProperty} from 'meteor/ejson';

// type Arg = EJSONable | EJSONable[] | EJSONableProperty | EJSONableProperty[];
type Arg = any;

type Executor = (...args: Arg[]) => any;

export default Executor;
