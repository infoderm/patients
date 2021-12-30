import snapshotTransaction from './snapshotTransaction';
import ClientSessionWrapper from './ClientSessionWrapper';

type ForEachAsyncCallback = (
	txn: ClientSessionWrapper,
	item: any,
) => Promise<any>;

const forEachAsync = async (collection, fn: ForEachAsyncCallback) =>
	snapshotTransaction(async (txn) => {
		const cursor = txn.find(collection, {}).hint({$natural: 1});
		for (;;) {
			// eslint-disable-next-line no-await-in-loop
			const item = await cursor.next();
			if (item === null) return;
			// eslint-disable-next-line no-await-in-loop
			await fn(txn, item);
		}
	});

export default forEachAsync;
