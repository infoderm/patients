import React from 'react';
import {Link} from 'react-router-dom';
import {
	styled,
	useTheme,
	type Theme,
	type CSSObject,
} from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BusinessIcon from '@mui/icons-material/Business';
import BugReportIcon from '@mui/icons-material/BugReport';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TodayIcon from '@mui/icons-material/Today';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BarChartIcon from '@mui/icons-material/BarChart';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import BookIcon from '@mui/icons-material/Book';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SettingsIcon from '@mui/icons-material/Settings';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import CropFreeIcon from '@mui/icons-material/CropFree';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';

import {setSetting} from './settings/hooks';
import Tooltip from './accessibility/Tooltip';

export const drawerWidthOpen = 215;

const DrawerItem = ({expand, disabled, link}) => (
	<Tooltip
		placement="right"
		title={expand ? '' : link.title}
		aria-label={link.title}
	>
		<ListItem button disabled={disabled} component={Link} to={link.to}>
			<ListItemIcon>{link.icon}</ListItemIcon>
			{expand && <ListItemText primary={link.title} />}
		</ListItem>
	</Tooltip>
);

type BlockLink = {
	title: string;
	to: string;
	icon: JSX.Element;
	disabled?: boolean;
};

type Block = {
	title: string;
	links: BlockLink[];
};

export const navigationDrawerBlocks: Block[] = [
	{
		title: 'main',

		links: [
			{
				to: '/new/patient',
				icon: <PersonAddIcon />,
				title: 'Nouveau',
			},

			{
				to: '/consultations/today',
				icon: <ScheduleIcon />,
				title: "Aujourd'hui",
			},

			{
				to: '/consultation/last',
				icon: <BookmarkIcon />,
				title: 'Dernière',
			},

			{
				to: '/calendar/week/current',
				icon: <TodayIcon />,
				title: 'Agenda',
			},

			{
				to: '/documents',
				icon: <LibraryBooksIcon />,
				title: 'Documents',
			},
		],
	},

	{
		title: 'management',

		links: [
			{
				to: '/books',
				icon: <BookIcon />,
				title: 'Carnets',
			},

			{
				to: '/paid',
				icon: <AccountBalanceIcon />,
				title: 'Paid',
			},

			{
				to: '/unpaid',
				icon: <MoneyOffIcon />,
				title: 'Unpaid',
			},

			{
				to: '/sepa',
				icon: <CropFreeIcon />,
				title: 'SEPA',
			},
		],
	},

	{
		title: 'issues',

		links: [
			{
				to: '/issues',
				icon: <ReportProblemIcon />,
				title: 'Issues',
			},

			{
				to: '/merge',
				icon: <MergeTypeIcon />,
				title: 'Merge',
			},
		],
	},

	{
		title: 'tags',

		links: [
			{
				to: '/doctors',
				icon: <SupervisorAccountIcon />,
				title: 'Doctors',
			},

			{
				to: '/insurances',
				icon: <BusinessIcon />,
				title: 'Insurances',
			},

			{
				to: '/allergies',
				icon: <BugReportIcon />,
				title: 'Allergies',
			},
		],
	},

	{
		title: 'external',

		links: [
			{
				to: '/drugs',
				icon: <LocalPharmacyIcon />,
				title: 'Drugs',
				disabled: true,
			},

			{
				to: '/hospitals',
				icon: <LocalHospitalIcon />,
				title: 'Hospitals',
				disabled: true,
			},
		],
	},

	{
		title: 'data',

		links: [
			{
				to: '/stats',
				icon: <BarChartIcon />,
				title: 'Stats',
			},
		],
	},

	{
		title: 'user',

		links: [
			{
				to: '/settings',
				icon: <SettingsIcon />,
				title: 'Settings',
			},

			{
				to: '/account',
				icon: <PersonIcon />,
				title: 'Account',
			},

			{
				to: '/auth',
				icon: <SecurityIcon />,
				title: 'Auth',
			},
		],
	},
];

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidthOpen,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(9)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({theme}) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
	width: drawerWidthOpen,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

export default function NavigationDrawer({
	currentUser,
	navigationDrawerIsOpen,
}) {
	const theme = useTheme();

	const toggleNavigationDrawerIsOpen = async () => {
		const newValue = navigationDrawerIsOpen === 'open' ? 'closed' : 'open';
		await setSetting('navigation-drawer-is-open', newValue);
	};

	return (
		<Drawer variant="permanent" open={navigationDrawerIsOpen === 'open'}>
			<DrawerHeader>
				<IconButton size="large" onClick={toggleNavigationDrawerIsOpen}>
					{theme.direction === 'rtl' ? (
						<ChevronRightIcon />
					) : (
						<ChevronLeftIcon />
					)}
				</IconButton>
			</DrawerHeader>
			<Divider />
			{navigationDrawerBlocks.map(({title, links}) => (
				<div key={title}>
					<List>
						{links.map((link) => (
							<DrawerItem
								key={link.to}
								disabled={!currentUser || link.disabled}
								expand={navigationDrawerIsOpen === 'open'}
								link={link}
							/>
						))}
					</List>
					<Divider />
				</div>
			))}
		</Drawer>
	);
}
