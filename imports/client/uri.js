import base64 from '@aureooms/js-codec-base64' ;

const options = { variant: 'RFC7515' } ;
const decode = x => base64.decode(x, options);
const encode = x => base64.encode(x, options);

const myEncodeURIComponent = encodeURIComponent;
const myDecodeURIComponent = decodeURIComponent;
const myEncodeURIComponent2 = component => decode(Buffer.from(component));
const myDecodeURIComponent2 = component => Buffer.from(encode(component)).toString();

export {
  myDecodeURIComponent,
  myEncodeURIComponent,
  myDecodeURIComponent2,
  myEncodeURIComponent2,
} ;
