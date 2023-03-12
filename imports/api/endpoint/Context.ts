import {type Meteor} from 'meteor/meteor';

type Context = Pick<Meteor.MethodThisType, 'userId'> & {
	connection: Pick<Meteor.Connection, 'clientAddress'> | null;
};

export default Context;
