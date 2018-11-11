import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
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
  const isSelected = (selectedItem || '').indexOf(itemToString(suggestion)) > -1;

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

class TagSelector extends React.Component {

  state = {
    inputValue: '' ,
  } ;

  handleKeyDown = event => {
    // TODO should take into account readonly flag of the input
    const { inputValue } = this.state;
    const { value , onChange } = this.props;
    switch(keycode(event)) {
      case 'backspace':
        if (value && value.length && !inputValue.length) {
          onChange({
            target: {
              value: value.slice(0, value.length - 1) ,
            } ,
          }) ;
        }
        break;
      case 'enter':
        if (inputValue.length) {
          // TODO do not do that when an change is about to occur
          const item = inputValue.trim();
          let newValue = (value||[]).slice();
          if (newValue.indexOf(item) === -1) newValue.push(item);

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
    this.setState({ inputValue: event.target.value.trimStart() });
  };

  handleChange = item => {
    const { value , onChange } = this.props;

    const newValue = (value || []).slice();
    if (newValue.indexOf(item) === -1) newValue.push(item);

    this.setState({
      inputValue: '',
    });

    onChange({
      target: {
        value: newValue ,
      } ,
    }) ;
  };

  handleDelete = item => () => {
    const { value , onChange } = this.props ;
    const newValue = (value || []).slice();
    newValue.splice(newValue.indexOf(item), 1);
    onChange({
      target: {
        value: newValue ,
      } ,
    }) ;
  };

  render() {
    const { value , classes , filter , suggestions , itemToString , itemToKey , chipProps , inputProps , placeholder } = this.props;
    const { inputValue } = this.state;

    console.debug('TagSelector', 'value', value);

    return (
      <Downshift
        inputValue={inputValue}
        onChange={this.handleChange}
        selectedItem={value || []}
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
              ...inputProps,
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                startAdornment: ( value || [] ).map(item => (
                  <Chip
                    {...chipProps}
                    key={item}
                    tabIndex={-1}
                    label={item}
                    className={classes.chip}
                    onDelete={this.handleDelete(item)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder: placeholder || '',
              }),
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {filter(suggestions, inputValue2)
                .filter(x=>(value||[]).indexOf(itemToString(x))===-1)
                .map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: itemToString(suggestion) }),
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
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

TagSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  filter: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  itemToKey: PropTypes.func.isRequired,
  itemToString: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(TagSelector);
