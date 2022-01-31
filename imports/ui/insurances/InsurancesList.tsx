import React from 'react';
import {useParams, useLocation} from 'react-router-dom';

import TagList from '../tags/TagList';

import {useInsurancesFind} from '../../api/insurances';
import {escapeStringRegexp} from '../../api/string';

import AlphabetJumper from '../navigation/AlphabetJumper';
import ReactiveInsuranceCard from './ReactiveInsuranceCard';

interface Props {
	defaultPage?: number;
	defaultPerpage?: number;
}

const InsurancesList = ({defaultPage = 1, defaultPerpage = 10}: Props) => {
	const location = useLocation();
	const params = useParams<{page?: string; prefix?: string}>();
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;
	const prefix = params.prefix;

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
				url={location.pathname}
				query={query}
				useTags={useInsurancesFind}
			/>
		</div>
	);
};

export default InsurancesList;
