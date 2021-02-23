import {Meteor} from 'meteor/meteor';
import promisify from '../util/promisify.js';

const apply = promisify(Meteor.apply.bind(Meteor));

export default apply;
