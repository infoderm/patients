import React from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import {useTheme, makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import BusinessIcon from '@material-ui/icons/Business';
import BugReportIcon from '@material-ui/icons/BugReport';
import ScheduleIcon from '@material-ui/icons/Schedule';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import TodayIcon from '@material-ui/icons/Today';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import BarChartIcon from '@material-ui/icons/BarChart';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import BookIcon from '@material-ui/icons/Book';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import SettingsIcon from '@material-ui/icons/Settings';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import CropFreeIcon from '@material-ui/icons/CropFree';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SecurityIcon from '@material-ui/icons/Security';

import {setSetting} from '../client/settings';
import Tooltip from './accessibility/Tooltip';

export const drawerWidthOpen = 215;

const useStyles = makeStyles((theme) => ({
	drawerPaper: {
		position: 'fixed',
		height: '100vh',
		overflowY: 'scroll',
	},
	drawerOpen: {
		width: drawerWidthOpen,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClosed: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1,
		},
	},
	drawer: {
		width: drawerWidthOpen,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
}));

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

export default function NavigationDrawer({
	currentUser,
	navigationDrawerIsOpen,
}) {
	const theme = useTheme();
	const classes = useStyles();

	const toggleNavigationDrawerIsOpen = () => {
		const newValue = navigationDrawerIsOpen === 'open' ? 'closed' : 'open';
		setSetting('navigation-drawer-is-open', newValue);
	};

	const blocks = [
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
			title: 'app',

			links: [
				{
					to: '/settings',
					icon: <SettingsIcon />,
					title: 'Settings',
				},

				{
					to: '/auth',
					icon: <SecurityIcon />,
					title: 'Authentication',
				},

				{
					to: '/stats',
					icon: <BarChartIcon />,
					title: 'Stats',
				},
			],
		},
	];

	return (
		<Drawer
			open={navigationDrawerIsOpen === 'open'}
			variant="permanent"
			className={classNames({
				[classes.drawerOpen]: navigationDrawerIsOpen === 'open',
				[classes.drawerClosed]: navigationDrawerIsOpen === 'closed',
			})}
			classes={{
				paper: classNames({
					[classes.drawerOpen]: navigationDrawerIsOpen === 'open',
					[classes.drawerClosed]: navigationDrawerIsOpen === 'closed',
				}),
			}}
			anchor="left"
		>
			<div className={classes.drawerHeader}>
				<IconButton onClick={toggleNavigationDrawerIsOpen}>
					{theme.direction === 'rtl' ? (
						<ChevronRightIcon />
					) : (
						<ChevronLeftIcon />
					)}
				</IconButton>
			</div>
			<Divider />

			{blocks.map(({title, links}) => (
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
