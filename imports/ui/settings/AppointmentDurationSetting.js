import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;
import { withStyles } from '@material-ui/core/styles' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import { list } from '@aureooms/js-itertools' ;
import { filter } from '@aureooms/js-itertools' ;

import { msToString , units } from '../../client/duration.js' ;

import SetPicker from '../input/SetPicker.js' ;

import Typography from '@material-ui/core/Typography' ;

import { settings } from '../../api/settings.js' ;

const durationUnits = units ;

const styles = theme => ({

}) ;

const KEY = 'appointment-duration' ;

class AppointmentDurationSetting extends React.Component {

	onChange = e => {

		const newValue = e.target.value ;

		Meteor.call(settings.methods.update, KEY, newValue, (err, res) => {

			if ( err ) {
				console.error(err) ;
			}
			else {
				console.debug('Setting', KEY, 'updated to', newValue) ;
			}

		}) ;

	} ;

	render ( ) {

		const {
			className ,
			loading ,
			value ,
		} = this.props ;

		return (
			<div className={className}>
				<Typography variant="h4">Appointment durations</Typography>
				<SetPicker
					readOnly={loading}
					suggestions={[]}
					filter={x=>x}
					itemToKey={x=>x}
					itemToString={x=>msToString(x)}
					onChange={this.onChange}
					TextFieldProps={{
						label: "Durations",
						margin: "normal",
					}}
					value={value}
					createNewItem={x=>parseInt(x,10) * durationUnits.minute}
					placeholder={loading ? 'loading...' : 'Give additional durations in minutes'}
					inputTransform={input => list(filter(x => '0' <= x && x <= '9', input)).join('')}
				/>
			</div>
		) ;
	}

}

let Component = AppointmentDurationSetting;

Component.propTypes = {
	value: PropTypes.array.isRequired,
} ;

Component = withStyles( styles , { withTheme: true })(Component)

Component = withTracker(() => {
	const handle = settings.subscribe(KEY) ;
	if ( handle.ready() ) {
		return {
			loading : false ,
			value : settings.get(KEY) ,
		} ;
	}
	else return {
		loading : true ,
		value : settings.defaults[KEY] ,
	} ;
})(Component) ;

export default Component ;
