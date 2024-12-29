type ObserveSequenceChangesCallbacks<T> = {
	addedBefore?(
		id: string,
		fields: Partial<Omit<T, '_id'>>,
		before: string | null,
	): Promise<void> | void;
	changed?(id: string, fields: Partial<Omit<T, '_id'>>): Promise<void> | void;
	movedBefore?(id: string, before: string | null): Promise<void> | void;
	removed?(id: string): Promise<void> | void;
};

export default ObserveSequenceChangesCallbacks;
