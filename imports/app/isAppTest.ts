import {Meteor} from 'meteor/meteor';

const isAppTest = () => Meteor.isAppTest;

export default isAppTest;
