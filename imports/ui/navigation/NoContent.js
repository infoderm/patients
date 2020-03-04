import React from 'react' ;

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  empty: {
    textAlign: 'center',
    margin: '3em 0',
    color: '#999',
  },
});

function NoContent ( { classes , children , ...props } ) {

  return (
    <Typography className={classes.empty} variant="h3" {...props}>{children}</Typography>
  ) ;

}

export default withStyles(styles, { withTheme: true })(NoContent) ;
