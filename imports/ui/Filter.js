import React from 'react';

import Downshift from 'downshift';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      {...other}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...InputProps,
      }}
    />
  );
}

const styles = theme => ({
  container: {
    position: 'relative',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    borderRadius: 2,
    background: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      background: fade(theme.palette.common.white, 0.25),
    },
  },
  suggestions: {
    position: 'absolute',
    width: '100%',
  },
  adornment: {
    display: 'inline-flex',
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'relative',
    pointerEvents: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
  },
  input: {
    border: 0,
    color: 'inherit',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    '&::before': {
      height: '0 !important',
      border: '0 !important',
    } ,
    '&::after': {
      height: '0 !important',
      border: '0 !important',
    } ,
  },
});

function Filter({ filter , suggestions , itemToString , classes , ...rest }) {

  return (
    <Downshift itemToString={itemToString} {...rest}>
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex,
      }) => (
        <div className={classes.container}>
          <div className={classes.adornment}><SearchIcon/></div>
          {renderInput({
            classes,
            InputProps: getInputProps({
              className: classes.input,
              placeholder: 'Search a patient',
            }),
          })}
          {isOpen ? (
            <Paper square className={classes.suggestions}>
              {filter(suggestions, inputValue).map((item, index) =>
                  <MenuItem
                    key={item._id}
                    {...getItemProps({
                      item,
                      index,
                      selected: highlightedIndex === index,
                      style: {
                        fontWeight: selectedItem === item ? 500 : 400,
                      },
                    })}
                  >
                    {itemToString(item)}
                  </MenuItem>
              )}
            </Paper>
          ) : null}
        </div>
      )}
    </Downshift>
  );
}

Filter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filter);
