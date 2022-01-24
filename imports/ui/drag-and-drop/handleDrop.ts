import insertPatient from '../../api/patients/insertPatient';
import insertDrugs from '../../api/drugs/insertDrugs';
import insertDocument from '../../api/documents/insertDocument';

function unpack(data, item) {
	if (item.kind === 'file') {
		const f = item.getAsFile();
		if (item.type === 'text/csv') {
			return ['drugs', f];
		}

		if (f.name.endsWith('.HLT')) {
			return ['healthone', f];
		}

		if (f.name.endsWith('.LAB')) {
			return ['healthone', f];
		}

		if (f.name.endsWith('.DAT')) {
			return ['healthone', f];
		}

		if (f.name.endsWith('.REP')) {
			return ['DMA-REP', f];
		}

		return ['unknown-file', f];
	}

	if (item.kind === 'string' && item.type === 'text/plain') {
		const xmlString = data.getData('text/plain');
		return ['patient', xmlString];
	}

	return ['unknown', item];
}

const handleDrop = (history) => async (data) => {
	console.debug('handleDrop', data);

	for (const item of data.items) {
		const [kind, object] = unpack(data, item);
		switch (kind) {
			case 'drugs':
				// eslint-disable-next-line no-await-in-loop
				await insertDrugs(object);
				break;
			case 'patient':
				// eslint-disable-next-line no-await-in-loop
				await insertPatient(history, object);
				break;
			case 'healthone':
			case 'DMA-REP':
				// eslint-disable-next-line no-await-in-loop
				await insertDocument(history, kind, object);
				break;
			default:
				console.debug('handleDrop-default', kind, object);
				break;
		}
	}
};

export default handleDrop;
