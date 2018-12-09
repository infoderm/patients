import React from 'react';

import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
	container: {
		padding: theme.spacing.unit * 3,
	},
});

function HealthOneReportContents ( { classes, document } ) {
	return (
		<Paper className={classes.container}>
			{document.text.map((line, i) => (
				<div key={i}>{line}</div>
			))}
		</Paper>
	) ;
}

export default withStyles(styles, {withTheme: true})(HealthOneReportContents);
