import makeCachedFindOne from '../../api/makeCachedFindOne';

import {Insurances, insurances} from '../../api/insurances';

const useCachedInsurance = makeCachedFindOne(
	Insurances,
	insurances.options.publication,
);

export default useCachedInsurance;
