import React from 'react' ;
import ReactLoading from 'react-loading';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	loadingAnimation: {
		margin: 'auto',
	},
});

function Loading ( { classes , theme , ...props } ) {

  return (
    <div>
      <ReactLoading
	className={classes.loadingAnimation}
	type="bubbles"
	color={theme.palette.primary.main}
	height={200}
	width={400}
	delay={250}
	{...props}
      />
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(Loading) ;
