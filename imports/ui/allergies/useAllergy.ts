import makeItem from '../tags/makeItem';

import {Allergies} from '../../api/collection/allergies';
import {allergies} from '../../api/allergies';

const useAllergy = makeItem(Allergies, allergies.options._singlePublication);

export default useAllergy;
