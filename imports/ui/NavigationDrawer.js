import {Meteor} from 'meteor/meteor';
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

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import BusinessIcon from '@material-ui/icons/Business';
import BugReportIcon from '@material-ui/icons/BugReport';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import TodayIcon from '@material-ui/icons/Today';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import PaymentIcon from '@material-ui/icons/Payment';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import BookIcon from '@material-ui/icons/Book';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import SettingsIcon from '@material-ui/icons/Settings';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

import {settings} from '../api/settings.js';

const drawerWidthOpen = 240;

const useStyles = makeStyles((theme) => ({
	drawerPaper: {
		position: 'fixed',
		height: '100vh',
		overflowY: 'scroll'
	},
	drawerOpen: {
		width: drawerWidthOpen,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClosed: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1
		}
	},
	drawer: {
		width: drawerWidthOpen,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar
	}
}));

export default function NavigationDrawer({
	currentUser,
	navigationDrawerIsOpen
}) {
	const theme = useTheme();
	const classes = useStyles();

	const toggleNavigationDrawerIsOpen = () => {
		const setting = 'navigation-drawer-is-open';

		const newValue = navigationDrawerIsOpen === 'open' ? 'closed' : 'open';

		Meteor.call(settings.methods.update, setting, newValue, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.debug('Setting', setting, 'updated to', newValue);
			}
		});
	};

	const blocks = [
		{
			title: 'main',

			links: [
				{
					to: '/consultations',
					icon: <FolderSharedIcon />,
					title: 'Consultations'
				},

				{
					to: '/documents',
					icon: <LibraryBooksIcon />,
					title: 'Documents'
				},

				{
					to: '/calendar',
					icon: <TodayIcon />,
					title: 'Calendar'
				},

				{
					// To: "/appointments" ,
					to: '/calendar/month/current',
					icon: <AccessTimeIcon />,
					title: 'Appointments',
					disabled: true
				},

				{
					to: '/import',
					icon: <CloudUploadIcon />,
					title: 'Import'
				}
			]
		},

		{
			title: 'management',

			links: [
				{
					to: '/books',
					icon: <BookIcon />,
					title: 'Carnets'
				},

				{
					to: '/wires',
					icon: <PaymentIcon />,
					title: 'Virements'
				},

				{
					to: '/third-party',
					icon: <AccountBalanceWalletIcon />,
					title: 'Tiers Payant'
				},

				{
					to: '/unpaid',
					icon: <MoneyOffIcon />,
					title: 'Unpaid'
				},

				{
					to: '/sepa',
					icon: <AccountBalanceIcon />,
					title: 'SEPA'
				},

				{
					to: '/stats',
					icon: <ShowChartIcon />,
					title: 'Stats',
					disabled: true
				}
			]
		},

		{
			title: 'issues',

			links: [
				{
					to: '/issues',
					icon: <ReportProblemIcon />,
					title: 'Issues'
				},

				{
					to: '/merge',
					icon: <MergeTypeIcon />,
					title: 'Merge'
				}
			]
		},

		{
			title: 'tags',

			links: [
				{
					to: '/doctors',
					icon: <SupervisorAccountIcon />,
					title: 'Doctors'
				},

				{
					to: '/insurances',
					icon: <BusinessIcon />,
					title: 'Insurances'
				},

				{
					to: '/allergies',
					icon: <BugReportIcon />,
					title: 'Allergies'
				}
			]
		},

		{
			title: 'external',

			links: [
				{
					to: '/drugs',
					icon: <LocalPharmacyIcon />,
					title: 'Drugs',
					disabled: true
				},

				{
					to: '/hospitals',
					icon: <LocalHospitalIcon />,
					title: 'Hospitals',
					disabled: true
				}
			]
		},

		{
			title: 'app',

			links: [
				{
					to: '/settings',
					icon: <SettingsIcon />,
					title: 'Settings'
				}
			]
		}
	];

	return (
		<Drawer
			open={navigationDrawerIsOpen === 'open'}
			variant="permanent"
			className={classNames({
				[classes.drawerOpen]: navigationDrawerIsOpen === 'open',
				[classes.drawerClosed]: navigationDrawerIsOpen === 'closed'
			})}
			classes={{
				paper: classNames({
					[classes.drawerOpen]: navigationDrawerIsOpen === 'open',
					[classes.drawerClosed]: navigationDrawerIsOpen === 'closed'
				})
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
							<ListItem
								key={link.to}
								button
								disabled={!currentUser || link.disabled}
								component={Link}
								to={link.to}
							>
								<ListItemIcon>{link.icon}</ListItemIcon>
								{navigationDrawerIsOpen === 'open' ? (
									<ListItemText primary={link.title} />
								) : null}
							</ListItem>
						))}
					</List>
					<Divider />
				</div>
			))}
		</Drawer>
	);
}
