import makeItem from '../tags/makeItem.js';

import {Insurances, insurances} from '../../api/insurances.js';

const useInsurance = makeItem(Insurances, insurances.options.singlePublication);

export default useInsurance;
