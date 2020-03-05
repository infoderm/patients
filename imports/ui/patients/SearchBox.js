import React from 'react';

import Downshift from 'downshift';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <InputBase
      {...other}
      inputRef={ref}
      inputProps={{
        classes: {
          input: classes.inputInput,
        },
        ...InputProps,
      }}
    />
  );
}

const styles = theme => ({
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
  suggestions: {
    position: 'absolute',
    width: '100%',
  },
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
  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    transition: theme.transitions.create('width'),
    width: '100%',
    color: 'white',
    [theme.breakpoints.up('sm')]: {
      width: 220,
      '&:focus': {
        width: 320,
      },
    },
  },
});

function SearchBox({ filter , suggestions , itemToString , classes , className , ...rest }) {

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
        <div className={className}>
          <div className={classes.container}>
            <div className={classes.adornment}><SearchIcon/></div>
            {renderInput({
              classes,
              InputProps: getInputProps({
                className: classes.inputInput,
                placeholder: 'Search a patient…',
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
        </div>
      )}
    </Downshift>
  );
}

SearchBox.propTypes = {
  classes: PropTypes.object.isRequired,
  filter: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
};

export default withStyles(styles)(SearchBox);
