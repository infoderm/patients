import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button' ;

import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { Uploads } from '../api/uploads.js';

const styles = theme => ({
	rightIcon: {
		marginLeft: theme.spacing.unit,
	},
});

class UploadConsultationAttachment extends React.Component {

    constructor (props) {
        super(props);
        this._input = null;
    }

    upload (event) {

      const consultationId = this.props.match.params.id;
      const files = event.target.files ;

      for ( const file of files ) {

        const upload = Uploads.insert({
            file ,
            streams: 'dynamic',
            chunkSize: 'dynamic'
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
                Meteor.call('consultations.attach', consultationId, fileObj._id, (err, res) => {
                  if ( err ) console.error(err) ;
                });
            }
        });

        upload.start();
      }
    }

    render () {
      const { classes } = this.props ;
      return (
        <div>
            <Button variant="raised" color="primary" onClick={() => this._input.click()}>
                Upload<CloudUploadIcon className={classes.rightIcon}/>
            </Button>
            <input
                multiple
                ref={node => this._input = node}
                onChange={this.upload.bind(this)}
                style={{ display: 'none' }}
                type="file"
            />
        </div>
      );
    }
}

UploadConsultationAttachment.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(UploadConsultationAttachment);
