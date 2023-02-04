import {Meteor} from 'meteor/meteor';

import useReactive from '../../api/publication/useReactive';

const useStatus = () => useReactive(() => Meteor.status());

export default useStatus;
