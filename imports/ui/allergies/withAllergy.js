import withItem from '../tags/withItem';

import {Allergies, allergies} from '../../api/allergies';

const withAllergy = withItem(Allergies, allergies.options.singlePublication);

export default withAllergy;
