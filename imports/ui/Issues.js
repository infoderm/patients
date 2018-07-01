import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import ConsultationsMissingAPrice from './issues/ConsultationsMissingAPrice.js' ;
import ConsultationsMissingABook from './issues/ConsultationsMissingABook.js' ;

const styles = theme => ({
	container: {
		padding: theme.spacing.unit * 3,
	},
});

const Issues = ( { classes } ) => (
	<div>
		<Typography variant="display2">Consultations missing a price</Typography>
		<ConsultationsMissingAPrice className={classes.container}/>
		<Typography variant="display2">Consultations missing a book</Typography>
		<ConsultationsMissingABook className={classes.container}/>
	</div>
) ;

Issues.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Issues) ;
