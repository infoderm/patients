import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const useStatus = () => useTracker(() => Meteor.status());

export default useStatus;
