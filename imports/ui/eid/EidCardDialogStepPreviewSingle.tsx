import React from 'react';

import type EidCardDialogStepPreviewSingleProps from './EidCardDialogStepPreviewSingleProps';
import EidCardDialogStepPreviewSingleCreate from './EidCardDialogStepPreviewSingleCreate';
import EidCardDialogStepPreviewSingleUpdate from './EidCardDialogStepPreviewSingleUpdate';

const EidCardDialogStepPreviewSingle = (
	props: EidCardDialogStepPreviewSingleProps,
) =>
	props.patientId === '?' ? (
		<EidCardDialogStepPreviewSingleCreate {...props} />
	) : (
		<EidCardDialogStepPreviewSingleUpdate {...props} />
	);

export default EidCardDialogStepPreviewSingle;
