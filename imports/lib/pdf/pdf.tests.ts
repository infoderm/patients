// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {client, server} from '../../_test/fixtures';

import {fetchPDF} from './pdf';

const document = `%PDF-1.
1 0 obj<</Pages 2 0 R>>endobj
2 0 obj<</Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Parent 2 0 R>>endobj
trailer <</Root 1 0 R>>
`;

client(__filename, () => {
	it('should work on the client', async () => {
		const data = new TextEncoder().encode(document);
		await fetchPDF({data});
	});
});

server(__filename, () => {
	it('should work on the server', async () => {
		const data = new TextEncoder().encode(document);
		await fetchPDF({data});
	});
});
