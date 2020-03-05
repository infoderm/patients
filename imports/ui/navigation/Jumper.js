import React from 'react';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  buttons: {
    paddingBottom: theme.spacing(3),
    textAlign: 'center',
  },
  button: {
      margin: theme.spacing(1),
  },
});

function Jumper ( { classes , items } ) {

	return (
        <div className={classes.buttons}>
			{
				items.map(
					({ key , url , disabled}) => (
					<Button key={key} className={classes.button} variant="outlined" component={Link} to={url} disabled={disabled}>
						{key}
					</Button>
				  )
				)
			}
		</div>
	) ;

}

export default withStyles(styles, { withTheme: true })(Jumper);
