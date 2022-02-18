import React from 'react';

import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {Route, Routes, useParams} from 'react-router-dom';
import TabJumper from '../navigation/TabJumper';
import {myEncodeURIComponent} from '../../util/uri';
import NoContent from '../navigation/NoContent';
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
	title: `${PREFIX}-title`,
};

const Root = styled('div')(({theme}) => ({
	[`& .${classes.setting}`]: {
		marginBottom: theme.spacing(3),
	},
	[`& .${classes.title}`]: {
		textAlign: 'center',
		marginBottom: theme.spacing(3),
	},
}));

const tabs = ['ui', 'theme', 'payment', 'locale', 'agenda', 'text'];

const SettingsTabs = () => {
	const params = useParams<{tab?: string}>();
	return (
		<TabJumper
			tabs={tabs}
			current={params.tab}
			toURL={(x) => `${params.tab ? '../' : ''}${myEncodeURIComponent(x)}`}
		/>
	);
};

export default function Settings() {
	return (
		<Root>
			<Typography variant="h2" className={classes.title}>
				Settings
			</Typography>
			<Typography variant="subtitle1" className={classes.title}>
				Global settings for the whole app
			</Typography>

			<Routes>
				<Route index element={<SettingsTabs />} />
				<Route path=":tab/*" element={<SettingsTabs />} />
			</Routes>

			<Routes>
				<Route path="/" element={<NoContent>Select a category</NoContent>} />
				<Route
					path="payment"
					element={
						<>
							<AccountHolderSetting className={classes.setting} />
							<IBANSetting className={classes.setting} />
							<CurrencySetting className={classes.setting} />
						</>
					}
				/>
				<Route
					path="ui"
					element={
						<NavigationDrawerIsOpenSetting className={classes.setting} />
					}
				/>
				<Route
					path="theme"
					element={
						<>
							<ThemePaletteModeSetting className={classes.setting} />
							<ThemePalettePrimarySetting className={classes.setting} />
							<ThemePaletteSecondarySetting className={classes.setting} />
						</>
					}
				/>
				<Route
					path="locale"
					element={
						<>
							<LanguageSetting className={classes.setting} />
							<WeekStartsOnSetting className={classes.setting} />
							<FirstWeekContainsDateSetting className={classes.setting} />
						</>
					}
				/>
				<Route
					path="agenda"
					element={
						<>
							<WorkScheduleSetting className={classes.setting} />
							<AppointmentDurationSetting className={classes.setting} />
							<DisplayedWeekDaysSetting className={classes.setting} />
							<AppointmentCancellationReasonSetting
								className={classes.setting}
							/>
						</>
					}
				/>
				<Route
					path="text"
					element={
						<>
							<TextTransformSetting className={classes.setting} />
							<ImportantStringsSetting className={classes.setting} />
						</>
					}
				/>
			</Routes>
		</Root>
	);
}
