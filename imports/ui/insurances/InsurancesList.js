import React from 'react';
import PropTypes from 'prop-types';
import TagList from '../tags/TagList.js';

import InsuranceCard from './InsuranceCard.js';
import {Insurances} from '../../api/insurances.js';

import AlphabetJumper from '../navigation/AlphabetJumper.js';

export default function InsurancesList({match, prefix, page, perpage}) {
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;
	prefix = (match && match.params.prefix) || prefix;

	const query = prefix ? {name: {$regex: '^' + prefix, $options: 'i'}} : {};

	return (
		<div>
			<AlphabetJumper current={prefix} toURL={(x) => `/insurances/${x}`} />
			<TagList
				page={page}
				perpage={perpage}
				collection={Insurances}
				Card={InsuranceCard}
				subscription="insurances"
				url={match.url}
				query={query}
			/>
		</div>
	);
}

InsurancesList.defaultProps = {
	page: 1,
	perpage: 10
};

InsurancesList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
	prefix: PropTypes.string
};
