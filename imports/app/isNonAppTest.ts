import {Meteor} from 'meteor/meteor';

const isNonAppTest = () => Meteor.isTest;

export default isNonAppTest;
