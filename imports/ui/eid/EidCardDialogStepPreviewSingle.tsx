import React from 'react';

import EidCardDialogStepPreviewSingleProps from './EidCardDialogStepPreviewSingleProps';
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
