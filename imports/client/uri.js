import base64 from '@aureooms/js-codec-base64' ;

const options = { variant: 'RFC7515' } ;
const decode = x => base64.decode(x, options);
const encode = x => base64.encode(x, options);

const myEncodeURIComponent = component => decode(Buffer.from(component));
const myDecodeURIComponent = component => Buffer.from(encode(component)).toString();

export {
  myDecodeURIComponent,
  myEncodeURIComponent,
} ;
