import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const useLoggingOut = () => useTracker(() => Meteor.loggingOut());

export default useLoggingOut;
