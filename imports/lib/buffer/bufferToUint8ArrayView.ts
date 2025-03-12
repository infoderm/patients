// @ts-expect-error Needs more recent @types/node
import {type Buffer} from 'buffer';

const _views = new WeakMap<Uint8Array, Buffer>();

const bufferToUint8ArrayView = (buffer: Buffer) => {
	const view = new Uint8Array(
		buffer.buffer,
		// @ts-expect-error Needs more recent @types/node
		buffer.offset,
		buffer.length,
	);

	// NOTE: Prevents input memory being reclaimed while view exists.
	_views.set(view, buffer);

	return view;
};

export default bufferToUint8ArrayView;
