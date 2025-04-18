import React from 'react';
import {type useNavigate} from 'react-router-dom';

import type useDialog from '../../ui/modal/useDialog';
import EidCardDialog from '../../ui/eid/EidCardDialog';

import eidParseXML from '../eidParseXML';

const insertPatient = async (
	navigate: ReturnType<typeof useNavigate>,
	dialog: ReturnType<typeof useDialog>,
	item: DataTransferItem,
) => {
	const xmlString = await new Promise<string>((resolve) => {
		item.getAsString(resolve);
	});

	const eidInfo = eidParseXML(xmlString);

	return dialog<void>((resolve, reject) => (
		<EidCardDialog
			open={false}
			navigate={navigate}
			eidInfo={eidInfo}
			onConfirm={() => {
				resolve();
			}}
			onCancel={() => {
				reject(new Error('Closed eid dialog.'));
			}}
		/>
	));
};

export default insertPatient;
