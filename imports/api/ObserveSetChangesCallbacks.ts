type ObserveSetChangesCallbacks<T> = {
	added?(id: string, fields: Partial<Omit<T, '_id'>>): Promise<void> | void;
	changed?(id: string, fields: Partial<Omit<T, '_id'>>): Promise<void> | void;
	removed?(id: string): Promise<void> | void;
};

export default ObserveSetChangesCallbacks;
