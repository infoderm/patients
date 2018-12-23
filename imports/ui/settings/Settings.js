import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;
import { withStyles } from '@material-ui/core/styles' ;

import React from 'react' ;

import Typography from '@material-ui/core/Typography' ;

import AppointmentDurationSetting from './AppointmentDurationSetting.js' ;

const styles = theme => ({

}) ;

class Settings extends React.Component {
	render ( ) {

		const {
		} = this.props ;

		return (
			<div>
				<Typography variant="h3">Settings</Typography>
				<Typography>
					Global settings for the whole app.
				</Typography>
				<div>
					<Typography variant="h4">Language</Typography>
				</div>
				<div>
					<Typography variant="h4">Currency</Typography>
				</div>
				<div>
					<Typography variant="h4">Capitalize</Typography>
				</div>
				<AppointmentDurationSetting/>
			</div>
		) ;
	}
}

let Component = Settings;

Component = withStyles( styles , { withTheme: true })(Component)

Component = withTracker(() => {
	return {
	} ;
})(Component) ;

export default Component ;
