import React from 'react';
import PropTypes from 'prop-types';
import TagList from '../tags/TagList.js';

import AllergyCard from './AllergyCard.js';
import {Allergies} from '../../api/allergies.js';

import AlphabetJumper from '../navigation/AlphabetJumper.js';

export default function AllergiesList({match, prefix, page, perpage}) {
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;
	prefix = (match && match.params.prefix) || prefix;

	const query = prefix ? {name: {$regex: '^' + prefix, $options: 'i'}} : {};

	return (
		<div>
			<AlphabetJumper current={prefix} toURL={(x) => `/allergies/${x}`} />
			<TagList
				page={page}
				perpage={perpage}
				collection={Allergies}
				Card={AllergyCard}
				subscription="allergies"
				url={match.url}
				query={query}
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
