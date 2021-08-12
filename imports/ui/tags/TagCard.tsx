import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import PropTypes, {InferProps} from 'prop-types';

import StaticTagCard, {
	StaticTagCardPropTypes,
	StaticTagCardProps,
} from './StaticTagCard';

const QueryPropTypes = {
	subscription: PropTypes.string,
	statsSubscription: PropTypes.string.isRequired,
	collection: PropTypes.any,
	statsCollection: PropTypes.any.isRequired,
	selector: PropTypes.object.isRequired,
	options: PropTypes.object,
	limit: PropTypes.number,
};

type TDataProps = Pick<StaticTagCardProps, 'items' | 'stats'>;
type QueryProps = InferProps<typeof QueryPropTypes>;

const ReactiveTagCardPropTypes = {
	...StaticTagCardPropTypes,
	...QueryPropTypes,
};

type ReactiveTagCardProps = StaticTagCardProps & QueryProps;

const ReactiveTagCard = withTracker<TDataProps, ReactiveTagCardProps>(
	({
		tag,
		subscription = undefined,
		statsSubscription,
		collection,
		statsCollection,
		selector,
		options,
		limit = 0,
	}) => {
		const name = tag.name;
		const handle = subscription
			? Meteor.subscribe(subscription, name, {...options, limit})
			: {ready: () => false};
		const statsHandle = Meteor.subscribe(statsSubscription, name);
		const result = {
			items: undefined,
			stats: undefined,
		};

		if (handle.ready() && collection) {
			result.items = collection.find(selector, {...options, limit}).fetch();
		}

		if (statsHandle.ready() && statsCollection) {
			result.stats = statsCollection.findOne({name});
		}

		return result;
	},
)(StaticTagCard);

ReactiveTagCard.propTypes = ReactiveTagCardPropTypes;

export default ReactiveTagCard;
