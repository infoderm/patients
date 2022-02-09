import makeQuery from '../../api/makeQuery';

import {Drugs} from '../../api/collection/drugs';
import publication from '../../api/publication/drugs/find';

const useDrugs = makeQuery(Drugs, publication);

export default useDrugs;
