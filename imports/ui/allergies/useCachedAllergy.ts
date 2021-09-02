import makeCachedFindOne from '../../api/makeCachedFindOne';

import {Allergies, allergies} from '../../api/allergies';

const useCachedAllergy = makeCachedFindOne(
	Allergies,
	allergies.options.publication,
);

export default useCachedAllergy;
