import React from 'react';

import {useInsurancesFind} from '../../api/insurances';

import type PropsOf from '../../lib/types/PropsOf';
import TagNamePrefixFilteredList from '../tags/TagNamePrefixFilteredList';

import ReactiveInsuranceCard from './ReactiveInsuranceCard';

type Props = Omit<
	PropsOf<typeof TagNamePrefixFilteredList>,
	'Card' | 'useTags'
>;

const InsurancesList = (props: Props) => {
	return (
		<TagNamePrefixFilteredList
			Card={ReactiveInsuranceCard}
			useTags={useInsurancesFind}
			{...props}
		/>
	);
};

export default InsurancesList;
