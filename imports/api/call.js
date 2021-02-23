import {Meteor} from 'meteor/meteor';
import promisify from '../util/promisify.js';

const call = promisify(Meteor.call.bind(Meteor));

export default call;
