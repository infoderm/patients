import {Meteor} from 'meteor/meteor';

import useReactive from '../../api/publication/useReactive';

const useLoggingIn = () => useReactive(() => Meteor.loggingIn(), []);

export default useLoggingIn;
