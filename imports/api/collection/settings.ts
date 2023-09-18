import define from './define';

type SettingDocument = {
	owner: string;
	key: string;
	value: any;
};

export const Settings = define<SettingDocument>('settings');
