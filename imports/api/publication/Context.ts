import {type Subscription as MeteorSubscriptionThisType} from 'meteor/meteor';

export type Context = MeteorSubscriptionThisType;

export type AuthenticatedContext = Context & {userId: string};
export type UnauthenticatedContext = Context & {userId: null};

export default Context;
