import {Meteor} from 'meteor/meteor';

const isProduction = () => Meteor.isProduction;

export default isProduction;
