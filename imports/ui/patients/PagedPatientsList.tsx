import React from 'react';

import Paginator from '../navigation/Paginator';
import Refresh from '../navigation/Refresh';

import {type PatientDocument} from '../../api/collection/patients';

import ReactivePatientCard from './ReactivePatientCard';
import PatientsPage from './PatientsPage';

type Props = {
	readonly loading: boolean;
	readonly perpage: number;
	readonly items: PatientDocument[];
	readonly refresh?: () => void;
	readonly dirty?: boolean;
};

const PagedPatientsList = ({
	loading,
	perpage,
	items,
	refresh = undefined,
	dirty = false,
}: Props) => {
	return (
		<>
			<PatientsPage patients={items} Card={ReactivePatientCard} />
			<Paginator loading={loading} end={items.length < perpage} />
			{refresh && dirty && <Refresh onClick={refresh} />}
		</>
	);
};

PagedPatientsList.projection = {
	firstname: 1,
	lastname: 1,
	birthdate: 1,
	sex: 1,
	niss: 1,
};

export default PagedPatientsList;
