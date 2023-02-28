import {type Mongo} from 'meteor/mongo';

type Projection<_> = Mongo.FieldSpecifier; // TODO Exploit genericity.

export default Projection;
