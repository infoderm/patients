import _apply from '../_apply';

import type Endpoint from './Endpoint';

const call = async <R>(endpoint: Endpoint<R>, ...args: any[]): Promise<R> =>
	_apply<R>(endpoint.name, args, endpoint.options);

export default call;
