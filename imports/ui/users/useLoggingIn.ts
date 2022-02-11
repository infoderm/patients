import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const useLoggingIn = () => useTracker(() => Meteor.loggingIn());

export default useLoggingIn;
