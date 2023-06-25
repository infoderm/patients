import {useSettingCached} from '../ui/settings/hooks';

import {useNavigatorLocale} from './navigator';

const useLocale = (): string => {
	const navigatorLocale = useNavigatorLocale();
	const {value} = useSettingCached('lang');
	return value === 'navigator' ? navigatorLocale : value;
};

export default useLocale;
