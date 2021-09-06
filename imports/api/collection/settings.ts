import {Mongo} from 'meteor/mongo';

interface SettingDocument {
	owner: string;
	key: string;
	value: any;
}

export const Settings = new Mongo.Collection<SettingDocument>('settings');
