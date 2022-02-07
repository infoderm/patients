import React from 'react';

import makeStyles from '@mui/styles/makeStyles';

import Fab from '@mui/material/Fab';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import patientsAttach from '../../api/endpoint/patients/attach';

import {computeFixedFabStyle} from '../button/FixedFab';

import PropsOf from '../../util/PropsOf';
import AttachFileButton from './AttachFileButton';
import AttachmentsForPatientPager from './AttachmentsForPatientPager';

const useStyles = makeStyles((theme) => ({
	attachButton: computeFixedFabStyle({theme, col: 4}),
}));

interface Props extends PropsOf<typeof AttachmentsForPatientPager> {
	patientId: string;
}

const AttachmentsForPatientStatic = ({patientId, ...rest}: Props) => {
	const classes = useStyles();

	return (
		<>
			<AttachmentsForPatientPager patientId={patientId} {...rest} />
			<AttachFileButton
				Button={Fab}
				className={classes.attachButton}
				color="default"
				endpoint={patientsAttach}
				item={patientId}
			>
				<AttachFileIcon />
			</AttachFileButton>
		</>
	);
};

export default AttachmentsForPatientStatic;
