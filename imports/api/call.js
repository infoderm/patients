import {Meteor} from 'meteor/meteor';
import promisify from '../util/promisify';

/**
 * @deprecated
 */
const call = promisify(Meteor.call.bind(Meteor));

export default call;
