import React from 'react';
import { Link } from 'react-router-dom';

import Downshift from 'downshift';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Menu, { MenuItem } from 'material-ui/Menu';
import { InputAdornment } from 'material-ui/Input';
import SearchIcon from 'material-ui-icons/Search';
import { fade } from 'material-ui/styles/colorManipulator';

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

function renderSuggestion(params) {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem } = params;
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem === suggestion.label;

  return (
    <MenuItem
      {...itemProps}
      selected={isHighlighted}
      component={Link}
      to={`/patient/${suggestion._id}`}
      key={suggestion._id}
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(suggestions, inputValue) {
  let count = 0;

  return suggestions.filter(suggestion => {
    const keep = count < 5 && (!inputValue || suggestion.label.toLowerCase().includes(inputValue.toLowerCase()));

    if (keep) ++count;

    return keep;
  });
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
    } ,
    '&::after': {
      height: '0 !important',
    } ,
  },
});

function Filter({ classes, suggestions }) {

  return (
    <Downshift>
      {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
        <div className={classes.container}>
          <div className={classes.adornment}><SearchIcon/></div>
          {renderInput({
            classes,
            InputProps: getInputProps({
              className: classes.input,
              placeholder: 'Search a patient',
              id: 'integration-downshift',
            }),
          })}
          {isOpen ? (
            <Paper square className={classes.suggestions}>
              {getSuggestions(suggestions, inputValue).map((suggestion, index) =>
                renderSuggestion({
                  suggestion,
                  index,
                  itemProps: getItemProps({ item: suggestion.label }),
                  highlightedIndex,
                  selectedItem,
                }),
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
