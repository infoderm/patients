import type Publication from './Publication';

const subscribe = ({name}: Publication, ...args: any[]) =>
	Meteor.subscribe(name, ...args);

export default subscribe;
