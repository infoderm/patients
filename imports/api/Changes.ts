export type Changes<T> = {
	$set?: Partial<T>;
	$unset?: {
		[K in keyof T]?: boolean;
	};
};
