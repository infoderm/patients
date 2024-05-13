// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime.js';

import {client, server} from '../../_test/fixtures';

import {fetchPDF} from './pdf';

const document = `%PDF-1.0
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000052 00000 n
0000000101 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
147
%EOF
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
