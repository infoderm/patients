import {Meteor} from 'meteor/meteor';

import useReactive from '../../api/publication/useReactive';

const useLoggingOut = () => useReactive(() => Meteor.loggingOut());

export default useLoggingOut;
