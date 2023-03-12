import {type Meteor} from 'meteor/meteor';
import Require from "../../lib/types/Require";

export type Context = Pick<Meteor.MethodThisType, 'userId'> & {
	connection: Pick<Meteor.Connection, 'clientAddress'> | null;
};

export type AuthenticatedContext = Require<Context, 'userId'>;
export type UnauthenticatedContext = Context & {userId: null};

export default Context;
