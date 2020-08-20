import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CurrencySetting from './CurrencySetting.js';
import TextTransformSetting from './TextTransformSetting.js';
import LanguageSetting from './LanguageSetting.js';
import NavigationDrawerIsOpenSetting from './NavigationDrawerIsOpenSetting.js';
import AppointmentDurationSetting from './AppointmentDurationSetting.js';
import ImportantStringsSetting from './ImportantStringsSetting.js';
import WeekStartsOnSetting from './WeekStartsOnSetting.js';
import IBANSetting from './IBANSetting.js';
import AccountHolderSetting from './AccountHolderSetting.js';

const useStyles = makeStyles((theme) => ({
	setting: {
		marginBottom: theme.spacing(3)
	}
}));

export default function Settings() {
	const classes = useStyles();

	return (
		<div>
			<Typography variant="h2">Settings</Typography>
			<Typography>Global settings for the whole app.</Typography>

			<Typography variant="h3">Payment Settings</Typography>
			<AccountHolderSetting className={classes.setting} />
			<IBANSetting className={classes.setting} />
			<CurrencySetting className={classes.setting} />

			<Typography variant="h3">UI Settings</Typography>
			<NavigationDrawerIsOpenSetting className={classes.setting} />
			<TextTransformSetting className={classes.setting} />

			<Typography variant="h3">Locale Settings</Typography>
			<LanguageSetting className={classes.setting} />
			<WeekStartsOnSetting className={classes.setting} />

			<Typography variant="h3">Other Settings</Typography>
			<ImportantStringsSetting className={classes.setting} />
			<AppointmentDurationSetting className={classes.setting} />
		</div>
	);
}
