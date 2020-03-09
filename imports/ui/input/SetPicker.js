import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';

import { all } from '@aureooms/js-itertools' ;
import { map } from '@aureooms/js-itertools' ;
import { list } from '@aureooms/js-itertools' ;

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem, itemToString , itemToKey }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem && itemToKey(selectedItem) === itemToKey(suggestion) ;

  return (
    <MenuItem
      {...itemProps}
      key={itemToKey(suggestion)}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {itemToString(suggestion)}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.object.isRequired,
};

class SetPicker extends React.Component {

  state = {
    inputValue: '' ,
    highlightedIndex: null ,
  } ;

  UNSAFE_componentWillReceiveProps ( nextProps ) {
    if ( nextProps.readOnly ) this.setState({inputValue: ''}) ;
  }

  handleKeyDown = event => {
    const { inputValue } = this.state;
    const {
      value,
      onChange,
      readOnly,
      itemToString,
      createNewItem,
      maxCount,
      multiset,
      sort,
    } = this.props;
    if ( readOnly ) return ;
    switch(keycode(event)) {
      case 'backspace':
        if (value.length && !inputValue.length) {
          onChange({
            target: {
              value: value.slice(0, value.length - 1) ,
            } ,
          }) ;
        }
        break;
      case 'enter':
        if (inputValue.length && (value.length < maxCount) && this.highlightedIndex === null && createNewItem) {

          const item = inputValue.trim();
          const newValue = value.slice();
          if (multiset || all(map(x=>x !== item, map(itemToString, value)))) {
            newValue.push(createNewItem(item));
            if (sort) sort(newValue);
          }

          this.setState({
            inputValue: '',
          });

          onChange({
            target: {
              value: newValue ,
            } ,
          }) ;
        }
        break;
    }
  };

  handleInputChange = event => {
    const {
      value,
      maxCount,
      inputTransform,
    } = this.props ;
    if ( value.length < maxCount ) {
      this.setState({
        inputValue: inputTransform(event.target.value.trimStart()) ,
      });
    }
    else {
      this.setState({
        inputValue: inputTransform('') ,
      });
    }
  };

  handleChange = item => {

    const {
      value,
      onChange,
      itemToString,
      maxCount,
      multiset,
      sort,
    } = this.props;

    if (value.length >= maxCount) return ;

    const newValue = value.slice();
    if (multiset || all(map(x=>x !== itemToString(item), map(itemToString, value)))) {
      newValue.push(item);
      if (sort) sort(newValue);
    }

    this.setState({
      inputValue: '',
    });

    onChange({
      target: {
        value: newValue ,
      } ,
    }) ;
  };

  stateReducer = ( state , changes ) => {
    switch ( changes.type ) {
      case Downshift.stateChangeTypes.changeInput:
        return {
          ...changes,
          highlightedIndex: null,
        } ;
      default:
        return changes;
    }
  } ;

  handleStateChange = ( changes , state ) => {
    this.highlightedIndex = state.highlightedIndex ;
  } ;

  handleDelete = index => () => {
    const { value , onChange } = this.props ;
    const newValue = value.slice();
    newValue.splice(index, 1);
    onChange({
      target: {
        value: newValue ,
      } ,
    }) ;
  };

  render() {

    const {
      value,
      classes,
      filter,
      suggestions,
      itemToString,
      itemToKey,
      chip,
      chipProps,
      TextFieldProps,
      placeholder,
      readOnly,
      maxCount,
    } = this.props;

    const { inputValue } = this.state;

    const ChipElement = chip || Chip;

    const full = value.length >= maxCount;

    return (
      <Downshift
        inputValue={inputValue}
        onChange={this.handleChange}
        stateReducer={this.stateReducer}
        onStateChange={this.handleStateChange}
        selectedItem={value}
        itemToString={itemToString}
        itemToKey={itemToKey}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div className={classes.container}>
            {renderInput({
              ...TextFieldProps,
              fullWidth: true,
              classes,
              inputProps: {
                readOnly: readOnly || full,
              },
              InputProps: getInputProps({
                startAdornment: value.map((item, index) => (
                  <ChipElement
                    {...chipProps}
                    key={itemToString(item)}
                    tabIndex={-1}
                    label={itemToString(item)}
                    className={classes.chip}
                    onDelete={readOnly ? null : this.handleDelete(index)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder: full ? '' : placeholder,
              }),
            })}
            {isOpen && !full ? (
              <Paper className={classes.paper} square>
                {filter(suggestions, inputValue2, itemToString)
                .map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                    itemToString: itemToString,
                    itemToKey: itemToKey,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing(1) / 2}px ${theme.spacing(1) / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing(2),
  },
});

SetPicker.defaultProps = {
  maxCount: Infinity,
  multiset: false,
  inputTransform: x => x,
} ;

SetPicker.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  filter: PropTypes.func.isRequired,
  itemToKey: PropTypes.func.isRequired,
  itemToString: PropTypes.func.isRequired,
  inputTransform: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  sort: PropTypes.func,
  createNewItem: PropTypes.func,
  maxCount: PropTypes.number.isRequired,
  multiset: PropTypes.bool.isRequired,
};

export default withStyles(styles)(SetPicker);
