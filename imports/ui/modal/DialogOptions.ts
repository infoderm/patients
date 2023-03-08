export type Append = (child: JSX.Element) => void;
export type Replace = (target: JSX.Element, replacement: JSX.Element) => void;
export type Remove = (child: JSX.Element) => void;
export type Key = () => string;

export const DEFAULT_APPEND: Append = (_child: JSX.Element) => {
	throw new Error('append not implemented');
};

export const DEFAULT_REPLACE: Replace = (
	_target: JSX.Element,
	_replacement: JSX.Element,
) => {
	throw new Error('replace not implemented');
};

export const DEFAULT_REMOVE: Remove = (_child: JSX.Element) => {
	throw new Error('remove not implemented');
};

export const DEFAULT_KEY: Key = () => {
	throw new Error('key not implemented');
};
