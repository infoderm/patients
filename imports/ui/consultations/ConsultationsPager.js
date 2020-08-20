import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';

import PropTypes from 'prop-types';

import {Consultations} from '../../api/consultations.js';

import PagedConsultationsList from './PagedConsultationsList.js';

const ConsultationsPager = (props) => {
	const {loading, page, perpage, root, url, items, itemProps, ...rest} = props;

	const _root = root || url.split('/page/')[0];

	return (
		<PagedConsultationsList
			loading={loading}
			root={_root}
			page={page}
			perpage={perpage}
			items={items}
			itemProps={itemProps}
			{...rest}
		/>
	);
};

ConsultationsPager.defaultProps = {
	page: 1,
	perpage: 10,
	query: {}
};

ConsultationsPager.propTypes = {
	root: PropTypes.string,
	url: PropTypes.string,
	page: PropTypes.number,
	perpage: PropTypes.number,

	query: PropTypes.object,
	sort: PropTypes.object.isRequired,

	loading: PropTypes.bool.isRequired,
	items: PropTypes.array.isRequired,
	itemProps: PropTypes.object
};

export default withTracker(({query, sort, page, perpage}) => {
	const handle = Meteor.subscribe('consultations', query);
	return {
		loading: !handle.ready(),
		items: Consultations.find(query, {
			sort,
			skip: (page - 1) * perpage,
			limit: perpage
		}).fetch()
	};
})(ConsultationsPager);
