import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button' ;

const styles = theme => ({
});

class InputFileButton extends React.Component {

    constructor (props) {
        super(props);
        this._input = null;
    }

    render () {
      const { onChange, ...rest } = this.props ;
      return (
        <div>
            <Button { ...rest} onClick={() => this._input.click()}/>
            <input
                multiple
                ref={node => this._input = node}
                onChange={onChange}
                style={{ display: 'none' }}
                type="file"
            />
        </div>
      );
    }
}

InputFileButton.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(InputFileButton);
