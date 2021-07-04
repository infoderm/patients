import {useSettingCached} from '../client/settings';

const useLocale = () => {
	const {value} = useSettingCached('lang');
	return value;
};

export default useLocale;
