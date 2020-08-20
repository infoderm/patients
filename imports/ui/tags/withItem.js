import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

const withItem = (collection, singlePublication) =>
	withTracker(({name}) => {
		const handle = Meteor.subscribe(singlePublication, name);
		if (handle.ready()) {
			const item = collection.findOne({name});
			return {
				loading: false,
				item
			};
		}

		return {loading: true};
	});

export default withItem;
