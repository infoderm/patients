import {useId} from 'react';

/**
 * @deprecated MUI v5 handles this for most inputs, and that's the only place
 * we need this.
 */
const useUniqueId = (prefix: string) => {
	const i = useId();
	return `${prefix}-${i}`;
};

export default useUniqueId;
