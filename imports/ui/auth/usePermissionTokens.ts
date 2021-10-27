import makeQuery from '../../api/makeQuery';
import {PermissionTokens} from '../../api/collection/permissionTokens';
import publication from '../../api/publication/permissionTokens/find';

const usePermissionTokens = makeQuery(PermissionTokens, publication);

export default usePermissionTokens;
