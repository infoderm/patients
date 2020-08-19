import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(
  theme => ({
    adornment: {
      display: 'inline-flex',
      width: theme.spacing(9),
      height: '100%',
      position: 'relative',
      pointerEvents: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
    },
  })
);

export default function SearchBoxInternalsAdornment ( ) {

  const classes = useStyles();

  return (
      <div className={classes.adornment}><SearchIcon/></div>
  );
}
