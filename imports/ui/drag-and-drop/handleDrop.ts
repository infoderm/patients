import {type useNavigate} from 'react-router-dom';

import insertPatient from '../../api/patients/insertPatient';
import insertDrugs from '../../api/drugs/insertDrugs';
import insertDocument from '../../api/documents/insertDocument';
import type useDialog from '../modal/useDialog';

function unpack(data, item) {
	if (item.kind === 'file') {
		const f = item.getAsFile();
		if (item.type === 'text/csv') {
			return ['drugs', f];
		}

		if (item.type === 'application/pdf') {
			return ['attachment', f];
		}

		return ['document', f];
	}

	if (item.kind === 'string' && item.type === 'text/plain') {
		const xmlString = data.getData('text/plain');
		return ['patient', xmlString];
	}

	return ['unknown', item];
}

const handleDrop =
	(
		navigate: ReturnType<typeof useNavigate>,
		dialog: ReturnType<typeof useDialog>,
	) =>
	async (data) => {
		console.debug('handleDrop', data);

		for (const item of data.items) {
			const [kind, object] = unpack(data, item);
			switch (kind) {
				case 'drugs': {
					// eslint-disable-next-line no-await-in-loop
					await insertDrugs(object);
					break;
				}

				case 'patient': {
					// eslint-disable-next-line no-await-in-loop
					await insertPatient(navigate, dialog, object);
					break;
				}

				case 'document': {
					// eslint-disable-next-line no-await-in-loop
					await insertDocument(navigate, undefined, object);
					break;
				}

				case 'attachment': {
					throw new Error(
						'Cannot drop PDFs! Please attach them to the patient directly.',
					);
				}

				default: {
					console.debug('handleDrop-default', kind, object);
					break;
				}
			}
		}
	};

export default handleDrop;
