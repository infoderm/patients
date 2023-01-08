import {type DependencyList} from 'react';
import usePreviousRenderValues from './usePreviousRenderValues';

const useChanged = (values: DependencyList) => {
	const previous = usePreviousRenderValues(values);
	return values.some((value, index) => value !== previous[index]);
};

export default useChanged;
