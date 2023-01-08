import React from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';

import patientsAttach from '../../api/endpoint/patients/attach';

import FixedFab from '../button/FixedFab';

import type PropsOf from '../../util/PropsOf';
import AttachFileButton from './AttachFileButton';
import AttachmentsForPatientPager from './AttachmentsForPatientPager';

type Props = {
	patientId: string;
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
} & PropsOf<typeof AttachmentsForPatientPager>;

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
