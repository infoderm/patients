import {type Mongo} from 'meteor/mongo';
import {type Meteor} from 'meteor/meteor';

declare module 'meteor/mongo' {
    namespace Mongo {
        interface Cursor<T, U = T> {
            observeAsync(callbacks: Mongo.ObserveCallbacks<U>): Promise<Meteor.LiveQueryHandle>;

            observeChangesAsync(
                callbacks: Mongo.ObserveChangesCallbacks<T>,
                options?: { nonMutatingCallbacks?: boolean | undefined },
            ): Promise<Meteor.LiveQueryHandle>;
        }

    }

}
