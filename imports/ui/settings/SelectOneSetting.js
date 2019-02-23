import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;
import { withStyles } from '@material-ui/core/styles' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography' ;

import { settings } from '../../api/settings.js' ;

import ValuePicker from '../input/ValuePicker.js' ;

const styles = theme => ({

}) ;

class SelectOneSetting extends React.Component {

	onChange = e => {

		const {
			setting ,
		} = this.props ;

		const newValue = e.target.value ;

		Meteor.call(settings.methods.update, setting, newValue, (err, res) => {

			if ( err ) {
				console.error(err) ;
			}
			else {
				console.debug('Setting', setting, 'updated to', newValue) ;
			}

		}) ;

	} ;

	render ( ) {

		const {
			className ,
			loading ,
			value ,
			options ,
			optionToString ,
			label ,
			title ,
		} = this.props ;

		return (
			<div className={className}>
				<Typography variant="h4">{title}</Typography>
				<ValuePicker
					readOnly={loading}
					options={options}
					optionToString={optionToString}
					onChange={this.onChange}
					label={label}
					value={value}
				/>
			</div>
		) ;
	}

}

let Component = SelectOneSetting;

Component.propTypes = {
	title: PropTypes.string.isRequired,
	label: PropTypes.string,
	options: PropTypes.array.isRequired,
	optionToString: PropTypes.func,
} ;

Component = withStyles( styles , { withTheme: true })(Component)

Component = withTracker(({setting}) => {
	// TODO load options from database?
	const handle = settings.subscribe(setting) ;
	if ( handle.ready() ) {
		return {
			loading : false ,
			value : settings.get(setting) ,
		} ;
	}
	else return {
		loading : true ,
		value : settings.defaults[setting] ,
	} ;
})(Component) ;

Component.propTypes = {
	setting: PropTypes.string.isRequired,
} ;

export default Component ;
