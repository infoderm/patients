import {type Meteor} from 'meteor/meteor';

export type Context = Pick<Meteor.MethodThisType, 'userId'> & {
	connection?: Pick<Meteor.Connection, 'clientAddress'> | null;
};

export type AuthenticatedContext = Context & {userId: string};
export type UnauthenticatedContext = Context & {userId: null};
