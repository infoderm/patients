import React from 'react';

import PropTypes from 'prop-types';

import Loading from '../navigation/Loading';
import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';
import NoContent from '../navigation/NoContent';

import ConsultationsList from './ConsultationsList';

export default function PagedConsultationsList(props) {
	const {
		root,
		loading,
		page,
		perpage,
		items,
		itemProps,
		refresh,
		dirty,
		...rest
	} = props;

	return (
		<div>
			{loading ? (
				<Loading />
			) : items.length > 0 ? (
				<ConsultationsList items={items} itemProps={itemProps} {...rest} />
			) : (
				<NoContent>{`Nothing to see on page ${page}.`}</NoContent>
			)}
			<Paginator page={page} end={items.length < perpage} root={root} />
			{refresh && dirty && <Refresh onClick={refresh} />}
		</div>
	);
}

PagedConsultationsList.defaultProps = {
	loading: false,
	dirty: false,
	refresh: undefined
};

PagedConsultationsList.propTypes = {
	root: PropTypes.string.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
	items: PropTypes.array.isRequired,
	loading: PropTypes.bool,
	refresh: PropTypes.func,
	dirty: PropTypes.bool
};
