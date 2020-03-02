import React from 'react' ;
import QRCode from 'qrcode.react' ;

import generateSEPAPaymentPayload from 'sepa-payment-qr-code' ;

export default function SEPAPaymentQRCode ( props ) {

	const {
		data,
		codeProps,
	} = props;

	try {

		const payload = generateSEPAPaymentPayload(data);

		const options = {
		  errorCorrectionLevel: 'H',
		  type: 'terminal',
		};

		return (
			<QRCode value={payload} {...codeProps}/>
			// CANNOT ACCESS CANVAS...
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
			// type = 'image/png' ;
			// encoderOptions = 0.92 ;
			// canvas.toDataURL(type, encoderOptions);
		) ;

	}

	catch ( err  ) {
		return (
			<div>{err.message}</div>
		);
	}

}
