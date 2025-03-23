import React from 'react';

import {useDoctorsWithNonAlphabeticalSymbols} from '../../api/issues';

import StaticDoctorCard from '../doctors/StaticDoctorCard';
import TagListPage from '../tags/TagListPage';

import paged from '../routes/paged';

const TagList = paged(TagListPage);

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const DoctorsWithNonAlphabeticalSymbols = (props: Props) => {
	return (
		<div {...props}>
			<TagList
				Card={StaticDoctorCard}
				useTags={useDoctorsWithNonAlphabeticalSymbols}
				LoadingIndicator={(_: {}) => <>Loading...</>}
				EmptyPage={({page}: {readonly page: number}) =>
					page === 1 ? (
						<>All doctors are made of alphabetical symbols only :)</>
					) : (
						// eslint-disable-next-line react/jsx-no-useless-fragment
						<>{`Nothing to see on page ${page}.`}</>
					)
				}
			/>
		</div>
	);
};

export default DoctorsWithNonAlphabeticalSymbols;
