import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles(
  theme => ({
    container: {
      position: 'relative',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(2),
      borderRadius: 2,
      background: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        background: fade(theme.palette.common.white, 0.25),
      },
    },
  })
);

export default function SearchBoxInternalsContainer ( { children } ) {
  const classes = useStyles();
  return <div className={classes.container}>{children}</div> ;
}
