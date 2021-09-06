import makeItem from '../tags/makeItem';

import {Insurances} from '../../api/collection/insurances';
import {insurances} from '../../api/insurances';

const useInsurance = makeItem(Insurances, insurances.options.singlePublication);

export default useInsurance;
