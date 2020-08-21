import {Meteor} from 'meteor/meteor';
import {useTracker} from 'meteor/react-meteor-data';

const makeItem = (collection, singlePublication) => (name, deps) =>
	useTracker(() => {
		const handle = Meteor.subscribe(singlePublication, name);
		if (handle.ready()) {
			const item = collection.findOne({name});
			return {
				loading: false,
				item
			};
		}

		return {loading: true};
	}, deps);

export default makeItem;
