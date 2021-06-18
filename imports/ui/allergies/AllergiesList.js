import React from 'react';
import PropTypes from 'prop-types';
import TagList from '../tags/TagList';

import {useAllergies} from '../../api/allergies';
import {escapeStringRegexp} from '../../api/string';

import AlphabetJumper from '../navigation/AlphabetJumper';
import AllergyCard from './AllergyCard';

export default function AllergiesList({match, prefix, page, perpage}) {
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;
	prefix = (match && match.params.prefix) || prefix;

	const query = prefix
		? {name: {$regex: '^' + escapeStringRegexp(prefix), $options: 'i'}}
		: {};

	return (
		<div>
			<AlphabetJumper current={prefix} toURL={(x) => `/allergies/${x}`} />
			<TagList
				page={page}
				perpage={perpage}
				Card={AllergyCard}
				url={match.url}
				query={query}
				useTags={useAllergies}
			/>
		</div>
	);
}

AllergiesList.defaultProps = {
	page: 1,
	perpage: 10
};

AllergiesList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
	prefix: PropTypes.string
};
