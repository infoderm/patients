import React from 'react';

import {useDoctorsFind} from '../../api/doctors';

import PropsOf from '../../util/PropsOf';
import TagNamePrefixFilteredList from '../tags/TagNamePrefixFilteredList';
import ReactiveDoctorCard from './ReactiveDoctorCard';

type Props = Omit<
	PropsOf<typeof TagNamePrefixFilteredList>,
	'Card' | 'useTags'
>;

const DoctorsList = (props: Props) => {
	return (
		<TagNamePrefixFilteredList
			Card={ReactiveDoctorCard}
			useTags={useDoctorsFind}
			{...props}
		/>
	);
};

export default DoctorsList;
