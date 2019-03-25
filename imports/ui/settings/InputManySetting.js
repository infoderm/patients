import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;
import { withStyles } from '@material-ui/core/styles' ;

import React from 'react' ;
import PropTypes from 'prop-types';

import SetPicker from '../input/SetPicker.js' ;

import Typography from '@material-ui/core/Typography' ;

import { settings } from '../../api/settings.js' ;

const styles = theme => ({

}) ;

class InputManySetting extends React.Component {

	onChange = e => {

		const setting = this.props.setting ;
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
			setting ,
			value ,
			title ,
			label ,
			placeholder ,
			...rest
		} = this.props ;

		return (
			<div className={className}>
				<Typography variant="h4">{title}</Typography>
				<SetPicker
					readOnly={loading}
					suggestions={[]}
					filter={x=>x}
					itemToKey={x=>x}
					itemToString={x=>x}
					createNewItem={x=>x}
					inputTransform={x=>x}
					onChange={this.onChange}
					TextFieldProps={{
						label,
						margin: "normal",
					}}
					value={value}
					placeholder={loading ? 'loading...' : placeholder}
					{...rest}
				/>
			</div>
		) ;
	}

}

let Component = InputManySetting;

Component.propTypes = {
	title: PropTypes.string.isRequired,
	label: PropTypes.string,
	value: PropTypes.array.isRequired,
} ;

Component = withStyles( styles , { withTheme: true })(Component)

Component = withTracker(({setting}) => {
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
