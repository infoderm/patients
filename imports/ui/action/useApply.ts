import apply from '../../api/endpoint/apply';
import useStatefulAsyncFunction from '../hooks/useStatefulAsyncFunction';

const useApply = () => useStatefulAsyncFunction(apply);

export default useApply;
