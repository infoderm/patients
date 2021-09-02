import React from 'react';
import PropTypes from 'prop-types';
import TagList from '../tags/TagList';

import {useInsurancesFind} from '../../api/insurances';
import {escapeStringRegexp} from '../../api/string';

import AlphabetJumper from '../navigation/AlphabetJumper';
import ReactiveInsuranceCard from './ReactiveInsuranceCard';

export default function InsurancesList({match, prefix, page, perpage}) {
	page = Number.parseInt(match?.params.page, 10) || page;
	prefix = match?.params.prefix || prefix;

	const query = prefix
		? {name: {$regex: '^' + escapeStringRegexp(prefix), $options: 'i'}}
		: {};

	return (
		<div>
			<AlphabetJumper current={prefix} toURL={(x) => `/insurances/${x}`} />
			<TagList
				page={page}
				perpage={perpage}
				Card={ReactiveInsuranceCard}
				url={match.url}
				query={query}
				useTags={useInsurancesFind}
			/>
		</div>
	);
}

InsurancesList.defaultProps = {
	page: 1,
	perpage: 10,
};

InsurancesList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
	prefix: PropTypes.string,
};
