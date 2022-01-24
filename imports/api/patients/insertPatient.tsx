import React from 'react';

import dialog from '../../ui/modal/dialog';
import EidCardDialog from '../../ui/eid/EidCardDialog';

import eidParseXML from '../eidParseXML';

const insertPatient = async (history, xmlString) => {
	const eidInfo = eidParseXML(xmlString);

	return dialog<void>((resolve) => (
		<EidCardDialog
			open={false}
			history={history}
			eidInfo={eidInfo}
			onClose={() => {
				resolve();
			}}
		/>
	));
};

export default insertPatient;
