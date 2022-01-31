import React from 'react';
import {useParams, useLocation} from 'react-router-dom';

import TagList from '../tags/TagList';

import {useAllergiesFind} from '../../api/allergies';
import {escapeStringRegexp} from '../../api/string';

import AlphabetJumper from '../navigation/AlphabetJumper';
import ReactiveAllergyCard from './ReactiveAllergyCard';

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const AllergiesList = ({defaultPage = 1, defaultPerpage = 10}: Props) => {
	const location = useLocation();
	const params = useParams<{page?: string; prefix?: string}>();
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;
	const prefix = params.prefix;

	const query = prefix
		? {name: {$regex: `^${escapeStringRegexp(prefix)}`, $options: 'i'}}
		: {};

	return (
		<div>
			<AlphabetJumper current={prefix} toURL={(x) => `/allergies/${x}`} />
			<TagList
				page={page}
				perpage={perpage}
				Card={ReactiveAllergyCard}
				url={location.pathname}
				query={query}
				useTags={useAllergiesFind}
			/>
		</div>
	);
};

export default AllergiesList;
