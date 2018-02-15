import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Menu, { MenuItem } from 'material-ui/Menu';
import Downshift from 'downshift';

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
    <Link to={`/patient/${suggestion._id}`} key={suggestion._id}>
      <MenuItem
        {...itemProps}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {suggestion.label}
      </MenuItem>
    </Link>
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

const styles = {
  container: {
    position: 'relative',
    flexGrow: 1,
    width: 200,
  },
  suggestions: {
    position: 'absolute',
    width: '100%',
  },
};

function Filter({ classes, suggestions}) {

  return (
    <Downshift>
      {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
        <div className={classes.container}>
          {renderInput({
            fullWidth: true,
            classes,
            InputProps: getInputProps({
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
