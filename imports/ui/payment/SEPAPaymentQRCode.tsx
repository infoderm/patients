import React from 'react';
import QRCode from 'qrcode.react';

import generateSEPAPaymentPayload from 'sepa-payment-qr-code';

export default function SEPAPaymentQRCode({data, codeProps, ...rest}) {
	try {
		const payload = generateSEPAPaymentPayload(data);

		// const options = {
		// errorCorrectionLevel: 'H',
		// type: 'terminal'
		// };

		return (
			<QRCode {...rest} value={payload} {...codeProps} />
			// CANNOT ACCESS CANVAS...
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
			// type = 'image/png' ;
			// encoderOptions = 0.92 ;
			// canvas.toDataURL(type, encoderOptions);
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return <div {...rest}>{error.message}</div>;
		}

		throw error;
	}
}
