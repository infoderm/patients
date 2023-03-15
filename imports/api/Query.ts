import type Options from './Options';
import type Selector from './Selector';

type Query<T> = {
	selector: Selector<T>;
	options: Options<T> | null;
};

export default Query;
