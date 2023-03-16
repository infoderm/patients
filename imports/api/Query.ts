import type Options from './QueryOptions';
import type Selector from './QuerySelector';

type Query<T> = {
	selector: Selector<T>;
	options: Options<T> | null;
};

export default Query;
