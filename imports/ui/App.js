import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data' ;

import { Patients } from '../api/patients.js';

import React from 'react' ;
import { withRouter } from 'react-router-dom' ;

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import CssBaseline from '@material-ui/core/CssBaseline';

import { sum , map } from '@aureooms/js-itertools';

import handleDrop from '../client/handleDrop.js';
import { settings } from '../api/settings.js';

import WholeWindowDropZone from './input/WholeWindowDropZone.js';
import Header from './Header.js';
import Router from './Router.js';
import NavigationDrawer from './NavigationDrawer.js';


const muitheme = createMuiTheme({
	typography: {
		useNextVariants: true,
	},
});

const styles = theme => ({
	appFrame: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		minHeight: '100vh',
	},
	progressbarContainer: {
		position: 'relative',
		display: 'flex',
		width: '100%',
		minHeight: '100vh',
	} ,
	progressbar: {
		margin: 'auto',
		height: 100,
		width: 100,
		fontWeight: 'bold',
	} ,
});

function App ( props ) {

	const {
		classes,
		theme,
		currentUser,
		patients,
		history,
		textTransform,
		navigationDrawerIsOpen,
		progress,
	} = props;

	return (
		<MuiThemeProvider theme={muitheme}>
			<CssBaseline/>
			{ progress < 1 ?
			<div className={classes.progressbarContainer}>
			<CircularProgressbar
				className={classes.progressbar}
				maxValue={1}
				value={progress}
				text={`${(100 * progress) | 0}%`}
				background
				backgroundPadding={6}
				styles={buildStyles({
					backgroundColor: theme.palette.primary.main,
					textColor: "#fff",
					pathColor: "#fff",
					trailColor: "transparent",
				})}
			/>
			</div>
			:
			<div>
				<WholeWindowDropZone callback={handleDrop(history)}/>
				<div className={classes.appFrame} style={{textTransform}}>
					<Header
						navigationDrawerIsOpen={navigationDrawerIsOpen}
						patients={patients}
						currentUser={currentUser}
					/>
					<NavigationDrawer
						navigationDrawerIsOpen={navigationDrawerIsOpen}
						currentUser={currentUser}
					/>
					<Router
						navigationDrawerIsOpen={navigationDrawerIsOpen}
						currentUser={currentUser}
						history={history}
						patients={patients}
					/>
				</div>
			</div>
			}
		</MuiThemeProvider>
	);
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
};

export default withRouter(
	withTracker(() => {
		const handles = [
			{ ready: () => true } ,
			Meteor.subscribe('patients') ,
			settings.subscribe('text-transform') ,
			settings.subscribe('navigation-drawer-is-open') ,
		] ;
		return {
			progress: sum(map(x => x.ready() ? 1 : 0, handles)) / handles.length,
			textTransform: settings.get('text-transform') ,
			navigationDrawerIsOpen: settings.get('navigation-drawer-is-open') ,
			currentUser: Meteor.user() ,
			patients: Patients.find({}, { sort: { lastname: 1 } }).fetch() ,
		};
	}) ( withStyles(styles, { withTheme: true }) (App) )
);
