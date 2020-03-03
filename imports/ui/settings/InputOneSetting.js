import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;
import { withStyles } from '@material-ui/core/styles' ;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography' ;
import TextField from '@material-ui/core/TextField';

import { settings } from '../../api/settings.js' ;

const styles = theme => ({

}) ;

// TODO validate should have three possible outcomes
//       1 valid input (sync)
//      -1 intermediate input (no sync, update, error/warning? label)
//       0 wrong input (no sync, no update)

function InputOneSetting (props) {

	const {
		className ,
		loading ,
		setting ,
		sanitize ,
		validate ,
		value ,
		label ,
		title ,
	} = props ;

	const [error, setError] = useState(false);

	useEffect(() => {
		const { outcome , message } = validate(value) ;
		setError(!outcome);
	});

	const onChange = e => {

		const newValue = sanitize( e.target.value ) ;

		Meteor.call(settings.methods.update, setting, newValue, (err, res) => {

			if ( err ) {
				console.error(err) ;
			}
			else {
				console.debug('Setting', setting, 'updated to', newValue) ;
			}

		}) ;

	} ;

	return (
		<div className={className}>
			{ title && <Typography variant="h4">{title}</Typography>}
			<TextField
				readOnly={loading}
				onChange={onChange}
				label={label}
				value={value}
				error={error}
			/>
		</div>
	) ;

}

let Component = InputOneSetting;

Component.propTypes = {
	title: PropTypes.string,
	label: PropTypes.string,
	sanitize: PropTypes.func.isRequired,
	validate: PropTypes.func.isRequired,
} ;

Component.defaultProps = {
  sanitize: x => x,
  validate: x => ({
    outcome: 1,
  }),
} ;

Component = withStyles( styles , { withTheme: true })(Component)

Component = withTracker(({setting}) => {
	const handle = settings.subscribe(setting) ;
	return {
		loading : !handle.ready() ,
		value : settings.get(setting) ,
	} ;
})(Component) ;

Component.propTypes = {
	setting: PropTypes.string.isRequired,
} ;

export default Component ;
