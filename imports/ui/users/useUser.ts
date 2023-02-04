import {Meteor} from 'meteor/meteor';

import useReactive from '../../api/publication/useReactive';

const useUser = () => useReactive(() => Meteor.user());

export default useUser;
