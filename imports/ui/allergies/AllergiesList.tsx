import React from 'react';

import {useAllergiesFind} from '../../api/allergies';

import PropsOf from '../../util/PropsOf';
import TagNamePrefixFilteredList from '../tags/TagNamePrefixFilteredList';
import ReactiveAllergyCard from './ReactiveAllergyCard';

type Props = Omit<
	PropsOf<typeof TagNamePrefixFilteredList>,
	'Card' | 'useTags'
>;

const AllergiesList = (props: Props) => {
	return (
		<TagNamePrefixFilteredList
			Card={ReactiveAllergyCard}
			useTags={useAllergiesFind}
			{...props}
		/>
	);
};

export default AllergiesList;
