import React from 'react';

import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import CurrencySetting from './CurrencySetting';
import TextTransformSetting from './TextTransformSetting';
import LanguageSetting from './LanguageSetting';
import NavigationDrawerIsOpenSetting from './NavigationDrawerIsOpenSetting';
import AppointmentDurationSetting from './AppointmentDurationSetting';
import AppointmentCancellationReasonSetting from './AppointmentCancellationReasonSetting';
import DisplayedWeekDaysSetting from './DisplayedWeekDaysSetting';
import ImportantStringsSetting from './ImportantStringsSetting';
import WeekStartsOnSetting from './WeekStartsOnSetting';
import FirstWeekContainsDateSetting from './FirstWeekContainsDateSetting';
import IBANSetting from './IBANSetting';
import AccountHolderSetting from './AccountHolderSetting';
import WorkScheduleSetting from './WorkScheduleSetting';
import ThemePaletteModeSetting from './ThemePaletteModeSetting';
import ThemePalettePrimarySetting from './ThemePalettePrimarySetting';
import ThemePaletteSecondarySetting from './ThemePaletteSecondarySetting';

const PREFIX = 'Settings';

const classes = {
	setting: `${PREFIX}-setting`,
};

const Root = styled('div')(({theme}) => ({
	[`& .${classes.setting}`]: {
		marginBottom: theme.spacing(3),
	},
}));

export default function Settings() {
	return (
		<Root>
			<Typography variant="h2">Settings</Typography>
			<Typography>Global settings for the whole app.</Typography>

			<Typography variant="h3">Payment Settings</Typography>
			<AccountHolderSetting className={classes.setting} />
			<IBANSetting className={classes.setting} />
			<CurrencySetting className={classes.setting} />

			<Typography variant="h3">UI Settings</Typography>
			<NavigationDrawerIsOpenSetting className={classes.setting} />
			<TextTransformSetting className={classes.setting} />

			<Typography variant="h3">Theme Settings</Typography>
			<ThemePaletteModeSetting className={classes.setting} />
			<ThemePalettePrimarySetting className={classes.setting} />
			<ThemePaletteSecondarySetting className={classes.setting} />

			<Typography variant="h3">Locale Settings</Typography>
			<LanguageSetting className={classes.setting} />
			<WeekStartsOnSetting className={classes.setting} />
			<FirstWeekContainsDateSetting className={classes.setting} />

			<Typography variant="h3">Other Settings</Typography>
			<ImportantStringsSetting className={classes.setting} />
			<AppointmentDurationSetting className={classes.setting} />
			<AppointmentCancellationReasonSetting className={classes.setting} />
			<DisplayedWeekDaysSetting className={classes.setting} />
			<WorkScheduleSetting className={classes.setting} />
		</Root>
	);
}
