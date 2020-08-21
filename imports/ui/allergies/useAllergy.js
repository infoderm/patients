import makeItem from '../tags/makeItem.js';

import {Allergies, allergies} from '../../api/allergies.js';

const useAllergy = makeItem(Allergies, allergies.options.singlePublication);

export default useAllergy;
