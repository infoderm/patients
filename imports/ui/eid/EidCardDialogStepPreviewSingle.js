import React from 'react';

import EidCardDialogStepPreviewSingleCreate from './EidCardDialogStepPreviewSingleCreate';
import EidCardDialogStepPreviewSingleUpdate from './EidCardDialogStepPreviewSingleUpdate';

const EidCardDialogStepPreviewSingle = (props) => {
	return props.patientId === '?' ? (
		<EidCardDialogStepPreviewSingleCreate {...props} />
	) : (
		<EidCardDialogStepPreviewSingleUpdate {...props} />
	);
};

export default EidCardDialogStepPreviewSingle;
