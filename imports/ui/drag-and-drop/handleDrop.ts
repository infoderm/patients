import {type useNavigate} from 'react-router-dom';

import insertPatient from '../../api/patients/insertPatient';
import insertDrugs from '../../api/drugs/insertDrugs';
import insertDocument from '../../api/documents/insertDocument';
import type useDialog from '../modal/useDialog';

function unpack(
	item: DataTransferItem,
):
	| ['drugs', File]
	| ['attachment', File]
	| ['document', File]
	| ['patient', DataTransferItem]
	| ['unknown', DataTransferItem] {
	if (item.kind === 'file') {
		const f = item.getAsFile()!;
		if (item.type === 'text/csv') {
			return ['drugs', f];
		}

		if (item.type === 'application/pdf') {
			return ['attachment', f];
		}

		return ['document', f];
	}

	if (item.kind === 'string' && item.type === 'text/plain') {
		return ['patient', item];
	}

	return ['unknown', item];
}

const _items = (data: DataTransfer): Iterable<DataTransferItem> => {
	// @ts-expect-error NOTE: DataTransferItem is actually an iterable.
	return data.items;
};

const handleDrop =
	(
		navigate: ReturnType<typeof useNavigate>,
		dialog: ReturnType<typeof useDialog>,
	) =>
	async (data: DataTransfer) => {
		console.debug('handleDrop', data);

		for (const item of _items(data)) {
			const [kind, object] = unpack(item);
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
