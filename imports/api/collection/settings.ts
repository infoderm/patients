import Collection from '../Collection';

type SettingDocument = {
	owner: string;
	key: string;
	value: any;
};

export const Settings = new Collection<SettingDocument>('settings');
