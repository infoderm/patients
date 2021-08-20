import React from 'react';
import PropTypes from 'prop-types';
import TagList from '../tags/TagList';

import {useAllergiesFind} from '../../api/allergies';
import {escapeStringRegexp} from '../../api/string';

import AlphabetJumper from '../navigation/AlphabetJumper';
import StaticAllergyCard from './StaticAllergyCard';

export default function AllergiesList({match, prefix, page, perpage}) {
	page = Number.parseInt(match?.params.page, 10) || page;
	prefix = match?.params.prefix || prefix;

	const query = prefix
		? {name: {$regex: '^' + escapeStringRegexp(prefix), $options: 'i'}}
		: {};

	return (
		<div>
			<AlphabetJumper current={prefix} toURL={(x) => `/allergies/${x}`} />
			<TagList
				page={page}
				perpage={perpage}
				Card={StaticAllergyCard}
				url={match.url}
				query={query}
				useTags={useAllergiesFind}
			/>
		</div>
	);
}

AllergiesList.defaultProps = {
	page: 1,
	perpage: 10,
};

AllergiesList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
	prefix: PropTypes.string,
};
