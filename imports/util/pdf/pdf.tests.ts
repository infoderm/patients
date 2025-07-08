import {client, server} from '../../_test/fixtures';
import {randomPDFUint8Array} from '../../_test/pdf';

import {fetchPDF} from './pdf';

client(__filename, () => {
	it('should work on the client', async () => {
		const data = randomPDFUint8Array();
		await fetchPDF({data});
	});
});

server(__filename, () => {
	it('should work on the server', async () => {
		const data = randomPDFUint8Array();
		await fetchPDF({data});
	}).timeout(3000);
});
