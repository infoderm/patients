import {Meteor} from 'meteor/meteor';

import useReactive from '../../api/publication/useReactive';

const useUserId = () => useReactive(() => Meteor.userId());

export default useUserId;
