import call from '../../api/endpoint/call';
import useStatefulAsyncFunction from '../hooks/useStatefulAsyncFunction';

const useCall = () => useStatefulAsyncFunction(call);

export default useCall;
