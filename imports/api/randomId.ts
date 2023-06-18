import {Random} from 'meteor/random';

const randomId = (): string => Random.id();

export default randomId;
