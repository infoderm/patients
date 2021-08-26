import Options from './Options';

interface Params<T> {
	name: string;
	validate: (...args: any[]) => void;
	run: (...args: any[]) => any;
	options?: Options<T>;
}

export default Params;
