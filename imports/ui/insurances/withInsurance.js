import withItem from '../tags/withItem.js';

import {Insurances, insurances} from '../../api/insurances.js';

const withInsurance = withItem(
	Insurances,
	insurances.options.singlePublication
);

export default withInsurance;
