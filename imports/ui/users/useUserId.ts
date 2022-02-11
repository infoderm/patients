import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const useUserId = () => useTracker(() => Meteor.userId());

export default useUserId;
