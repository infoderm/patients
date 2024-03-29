import React from 'react';
import {type useNavigate} from 'react-router-dom';

import type useDialog from '../../ui/modal/useDialog';
import EidCardDialog from '../../ui/eid/EidCardDialog';

import eidParseXML from '../eidParseXML';

const insertPatient = async (
	navigate: ReturnType<typeof useNavigate>,
	dialog: ReturnType<typeof useDialog>,
	xmlString: string,
) => {
	const eidInfo = eidParseXML(xmlString);

	return dialog<void>((resolve) => (
		<EidCardDialog
			open={false}
			navigate={navigate}
			eidInfo={eidInfo}
			onClose={() => {
				resolve();
			}}
		/>
	));
};

export default insertPatient;
