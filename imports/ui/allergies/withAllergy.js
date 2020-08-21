import withItem from '../tags/withItem.js';

import {Allergies, allergies} from '../../api/allergies.js';

const withAllergy = withItem(Allergies, allergies.options.singlePublication);

export default withAllergy;
