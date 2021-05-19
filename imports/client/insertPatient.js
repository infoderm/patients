import React from 'react';

import dialog from '../ui/modal/dialog.js';
import EidCardDialog from '../ui/eid/EidCardDialog.js';

import eidParseXML from '../api/eidParseXML.js';

export default function insertPatient(history, xmlString) {
	const eidInfo = eidParseXML(xmlString);

	dialog((resolve) => (
		<EidCardDialog
			history={history}
			eidInfo={eidInfo}
			onClose={() => {
				resolve();
			}}
		/>
	));
}
