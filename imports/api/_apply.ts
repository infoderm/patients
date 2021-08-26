import {Meteor} from 'meteor/meteor';
import promisify from '../util/promisify';

const _apply = promisify(Meteor.apply.bind(Meteor));

export default _apply;
