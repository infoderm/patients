import {useSettingCached} from '../ui/settings/hooks';

const useLocale = () => {
	const {value} = useSettingCached('lang');
	return value;
};

export default useLocale;
