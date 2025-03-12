import React from 'react';

import Grid from '@mui/material/Grid';
import FaceIcon from '@mui/icons-material/Face';

import {useDateFormat} from '../../i18n/datetime';

import pngDataURL from '../../util/png/dataURL';

import eidDisplayBirthdate from '../../api/eidDisplayBirthdate';

import TextField from '../input/TextField';
import {Subheader, SubheaderAvatar} from '../Subheader';
import CopiableTextField from '../input/CopiableTextField';

import useCachedPatient from './useCachedPatient';

type Props = {
	readonly patientId: string;
};

const PatientHeader = ({patientId}: Props) => {
	const init = {_id: patientId};
	const query = {filter: {_id: patientId}};
	const deps = [patientId];

	const {loading, found, fields: patient} = useCachedPatient(init, query, deps);

	const localizeBirthdate = useDateFormat('PPP');

	const textPlaceHolder = loading ? '' : '?';

	return (
		<Subheader container spacing={3}>
			<Grid item>
				{patient.photo ? (
					<SubheaderAvatar
						alt={`${patient.firstname} ${patient.lastname}`}
						src={pngDataURL(patient.photo)}
					/>
				) : (
					<SubheaderAvatar>
						<FaceIcon />
					</SubheaderAvatar>
				)}
			</Grid>
			<Grid item xs={2}>
				<CopiableTextField
					readOnly
					label="Lastname"
					value={patient.lastname ?? ''}
					placeholder={textPlaceHolder}
				/>
			</Grid>
			<Grid item xs={2}>
				<CopiableTextField
					readOnly
					label="Firstname"
					value={patient.firstname ?? ''}
					placeholder={textPlaceHolder}
				/>
			</Grid>
			<Grid item xs={2}>
				<CopiableTextField
					readOnly
					label="NISS"
					value={patient.niss ?? ''}
					placeholder={textPlaceHolder}
				/>
			</Grid>
			<Grid item xs={2}>
				<TextField
					readOnly
					label="Birth date"
					value={eidDisplayBirthdate(
						patient.birthdate ?? '',
						localizeBirthdate,
					)}
					InputLabelProps={{
						shrink: true,
					}}
					placeholder={textPlaceHolder}
				/>
			</Grid>
			<Grid item xs={2}>
				<TextField
					readOnly
					label="Patient id"
					value={patientId}
					error={!loading && !found}
				/>
			</Grid>
		</Subheader>
	);
};

export default PatientHeader;
