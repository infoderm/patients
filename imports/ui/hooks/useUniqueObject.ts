import {useReducer} from 'react';

const newUniqueObject = () => ({});
const useUniqueObject = () =>
	useReducer(newUniqueObject, undefined, newUniqueObject);

export default useUniqueObject;
