import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;
import { withStyles } from '@material-ui/core/styles' ;

import React from 'react' ;

import Typography from '@material-ui/core/Typography' ;

import TextTransformSetting from './TextTransformSetting.js' ;
import LanguageSetting from './LanguageSetting.js' ;
import AppointmentDurationSetting from './AppointmentDurationSetting.js' ;
import WeekStartsOnSetting from './WeekStartsOnSetting.js' ;

const styles = theme => ({
	setting : {
		marginBottom: theme.spacing.unit * 3 ,
	} ,
}) ;

class Settings extends React.Component {

	render ( ) {

		const {
			classes ,
		} = this.props ;

		return (
			<div>
				<Typography variant="h3">Settings</Typography>
				<Typography>
					Global settings for the whole app.
				</Typography>
				<div>
					<Typography variant="h4">Currency</Typography>
				</div>
				<TextTransformSetting className={classes.setting}/>
				<LanguageSetting className={classes.setting}/>
				<AppointmentDurationSetting className={classes.setting}/>
				<WeekStartsOnSetting className={classes.setting}/>
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
