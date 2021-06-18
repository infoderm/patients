import {Meteor} from 'meteor/meteor';
import promisify from '../util/promisify';

const apply = promisify(Meteor.apply.bind(Meteor));

export default apply;
