import Options from './Options';

interface Params<T> {
	readonly name: string;
	readonly validate: (...args: any[]) => void;
	readonly run: (...args: any[]) => any;
	readonly simulate?: (...args: any[]) => any;
	readonly options?: Options<T>;
}

export default Params;
