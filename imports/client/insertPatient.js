import React from 'react';

import dialog from '../ui/modal/dialog';
import EidCardDialog from '../ui/eid/EidCardDialog';

import eidParseXML from '../api/eidParseXML';

export default function insertPatient(history, xmlString) {
	const eidInfo = eidParseXML(xmlString);

	dialog((resolve) => (
		<EidCardDialog
			open={false}
			history={history}
			eidInfo={eidInfo}
			onClose={() => {
				resolve();
			}}
		/>
	));
}
