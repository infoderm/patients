import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
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
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
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

const styles = {
  container: {
    flexGrow: 1,
    width: 200,
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
              placeholder: 'Search a country (start with a)',
              id: 'integration-downshift',
            }),
          })}
          {isOpen ? (
            <Paper square>
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
