import React from 'react';

import {styled} from '@mui/material/styles';

import Fab from '@mui/material/Fab';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import patientsAttach from '../../api/endpoint/patients/attach';

import {computeFixedFabStyle} from '../button/FixedFab';

import PropsOf from '../../util/PropsOf';
import AttachFileButton from './AttachFileButton';
import AttachmentsForPatientPager from './AttachmentsForPatientPager';

const PREFIX = 'AttachmentsForPatientStatic';

const classes = {
	attachButton: `${PREFIX}-attachButton`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({theme}) => ({
	[`& .${classes.attachButton}`]: computeFixedFabStyle({theme, col: 4}),
}));

interface Props extends PropsOf<typeof AttachmentsForPatientPager> {
	patientId: string;
}

const AttachmentsForPatientStatic = ({patientId, ...rest}: Props) => {
	return (
		<Root>
			<AttachmentsForPatientPager patientId={patientId} {...rest} />
			<AttachFileButton
				Button={Fab}
				className={classes.attachButton}
				endpoint={patientsAttach}
				item={patientId}
			>
				<AttachFileIcon />
			</AttachFileButton>
		</Root>
	);
};

export default AttachmentsForPatientStatic;
