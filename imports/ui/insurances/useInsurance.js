import makeItem from '../tags/makeItem';

import {Insurances, insurances} from '../../api/insurances';

const useInsurance = makeItem(Insurances, insurances.options.singlePublication);

export default useInsurance;
