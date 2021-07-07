import makeItem from '../tags/makeItem';

import {Allergies, allergies} from '../../api/allergies';

const useAllergy = makeItem(Allergies, allergies.options.singlePublication);

export default useAllergy;
