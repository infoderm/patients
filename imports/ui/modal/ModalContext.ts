import {createContext} from 'react';
import {
	type Append,
	type Key,
	DEFAULT_APPEND,
	DEFAULT_KEY,
	DEFAULT_REMOVE,
	DEFAULT_REPLACE,
	type Remove,
	type Replace,
} from './DialogOptions';

export type Context = {
	append: Append;
	replace: Replace;
	remove: Remove;
	key: Key;
};

const ModalContext = createContext<Context>({
	append: DEFAULT_APPEND,
	replace: DEFAULT_REPLACE,
	remove: DEFAULT_REMOVE,
	key: DEFAULT_KEY,
});

export default ModalContext;
