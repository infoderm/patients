// import {EJSONable, EJSONableProperty} from 'meteor/ejson';

// type Arg = EJSONable | EJSONable[] | EJSONableProperty | EJSONableProperty[];
type Arg = any;

type Executor<R> = (...args: Arg[]) => Promise<R> | R;

export default Executor;
