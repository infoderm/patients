import {type Subscription as MeteorPublicationThisType} from 'meteor/meteor';

type Subscription = MeteorPublicationThisType & {userId: string};

export default Subscription;
