import React from 'react';
import PropTypes from 'prop-types';
import TagList from '../tags/TagList';

import {useDoctors} from '../../api/doctors';
import {escapeStringRegexp} from '../../api/string';

import AlphabetJumper from '../navigation/AlphabetJumper';
import StaticDoctorCard from './StaticDoctorCard';

export default function DoctorsList({match, prefix, page, perpage}) {
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;
	prefix = (match && match.params.prefix) || prefix;

	const query = prefix
		? {name: {$regex: '^' + escapeStringRegexp(prefix), $options: 'i'}}
		: {};

	return (
		<div>
			<AlphabetJumper current={prefix} toURL={(x) => `/doctors/${x}`} />
			<TagList
				page={page}
				perpage={perpage}
				Card={StaticDoctorCard}
				url={match.url}
				query={query}
				useTags={useDoctors}
			/>
		</div>
	);
}

DoctorsList.defaultProps = {
	page: 1,
	perpage: 10,
};

DoctorsList.propTypes = {
	page: PropTypes.number,
	perpage: PropTypes.number,
	prefix: PropTypes.string,
};
