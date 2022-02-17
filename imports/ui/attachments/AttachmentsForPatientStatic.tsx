import React from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';

import patientsAttach from '../../api/endpoint/patients/attach';

import FixedFab from '../button/FixedFab';

import PropsOf from '../../util/PropsOf';
import AttachFileButton from './AttachFileButton';
import AttachmentsForPatientPager from './AttachmentsForPatientPager';

interface Props extends PropsOf<typeof AttachmentsForPatientPager> {
	patientId: string;
}

const AttachmentsForPatientStatic = ({patientId, ...rest}: Props) => {
	return (
		<>
			<AttachmentsForPatientPager patientId={patientId} {...rest} />
			<AttachFileButton
				Button={FixedFab}
				col={4}
				endpoint={patientsAttach}
				item={patientId}
			>
				<AttachFileIcon />
			</AttachFileButton>
		</>
	);
};

export default AttachmentsForPatientStatic;
