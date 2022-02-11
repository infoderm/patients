import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const useUser = () => useTracker(() => Meteor.user());

export default useUser;
