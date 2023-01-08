import {Mongo} from 'meteor/mongo';

type SettingDocument = {
	owner: string;
	key: string;
	value: any;
};

export const Settings = new Mongo.Collection<SettingDocument>('settings');
