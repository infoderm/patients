import React from 'react';

import EidCardDialogStepPreviewSingleCreate from './EidCardDialogStepPreviewSingleCreate.js';
import EidCardDialogStepPreviewSingleUpdate from './EidCardDialogStepPreviewSingleUpdate.js';

const EidCardDialogStepPreviewSingle = (props) => {
	return props.patientId === '?' ? (
		<EidCardDialogStepPreviewSingleCreate {...props} />
	) : (
		<EidCardDialogStepPreviewSingleUpdate {...props} />
	);
};

export default EidCardDialogStepPreviewSingle;
