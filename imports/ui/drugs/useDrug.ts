import makeFindOne from '../../api/makeFindOne';

import {Drugs} from '../../api/collection/drugs';
import publication from '../../api/publication/drugs/findOne';

const useDrug = makeFindOne(Drugs, publication);

export default useDrug;
