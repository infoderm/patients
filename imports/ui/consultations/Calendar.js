import React from 'react' ;
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom' ;

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { format } from 'date-fns' ;

const styles = theme => ({
});

class Calendar extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			day: format( new Date(), 'YYYY-MM-DD' ) ,
		};
	}

	onDayClick = e => {
		const day = e.target.value ;
		this.setState({ day }) ;
		this.props.history.push(`calendar/${day}`);
	}

	render ( ) {

		return (
			<Grid container>
				<Grid item xs={2}>
					<TextField type="date"
						s={2}
						label="Day"
						InputLabelProps={{
						  shrink: true,
						}}
						value={this.state.day}
						onChange={this.onDayClick}
					/>
				</Grid>
			</Grid>
		);
	}

}

Calendar.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(Calendar)) ;
