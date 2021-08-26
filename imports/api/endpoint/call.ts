import _apply from '../_apply';

import Endpoint from './Endpoint';

const call = async <T>(endpoint: Endpoint<T>, ...args: any[]) =>
	_apply(endpoint.name, args, endpoint.options);

export default call;
