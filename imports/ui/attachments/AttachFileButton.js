import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import AttachFileIcon from '@material-ui/icons/AttachFile';

import InputFileButton from '../input/InputFileButton.js';

import { Uploads } from '../../api/uploads.js';

const styles = theme => ({
});

class AttachFileButton extends React.Component {

    constructor (props) {
        super(props);
    }

    upload (event) {

      const itemId = this.props.item;
      const method = this.props.method;
      const files = event.target.files ;

      for ( const file of files ) {

        const upload = Uploads.insert({
            file ,
            streams: 'dynamic',
            chunkSize: 'dynamic',
            meta: {
                createdAt: new Date(),
            },
        }, false);

        upload.on('start', function () {
            console.log(`[Upload] started`);
        });

        upload.on('end', function (err, fileObj) {
            if (err) {
                console.error(`[Upload] Error during upload: ${err}`);
            }
            else {
                console.log(`[Upload] File "${fileObj.name} (${fileObj._id})" successfully uploaded`);
                Meteor.call(method, itemId, fileObj._id, (err, res) => {
                  if ( err ) console.error(err) ;
                  else console.log(`[Attach] File "${fileObj.name} (${fileObj._id})" successfully attached to item "${itemId}" using method "${method}".`) ;
                });
            }
        });

        upload.start();
      }
    }

    render () {
      const { method , item , children , ...rest } = this.props ;
      return (
        <InputFileButton onChange={this.upload.bind(this)} {...rest}>
            { children || <Fragment>Attach File<AttachFileIcon/></Fragment>}
        </InputFileButton>
      );
    }
}

AttachFileButton.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AttachFileButton);
