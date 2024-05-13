import _dataURL from '../dataURL';

const dataURL = (base64: string) => _dataURL('image/png', base64);
export default dataURL;
