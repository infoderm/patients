import {useSettingCached} from '../ui/settings/hooks';
import {navigatorLocale} from './navigator';

const useLocale = (): string => {
	const {value} = useSettingCached('lang');
	return value === 'navigator' ? navigatorLocale() : value;
};

export default useLocale;
