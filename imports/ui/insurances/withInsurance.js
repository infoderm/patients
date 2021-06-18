import withItem from '../tags/withItem';

import {Insurances, insurances} from '../../api/insurances';

const withInsurance = withItem(
	Insurances,
	insurances.options.singlePublication
);

export default withInsurance;
