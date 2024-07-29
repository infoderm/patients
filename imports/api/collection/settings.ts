import define from './define';

export type SettingDocument = {
	owner: string;
	key: string;
	value: any;
};

export const Settings = define<SettingDocument>('settings');
