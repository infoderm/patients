import { Meteor } from 'meteor/meteor' ;

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import LinkOffIcon from '@material-ui/icons/LinkOff';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
}) ;

class HLTReportUnlinkingDialog extends React.Component {

  constructor ( props ) {
    super( props ) ;
  }

  render () {

    const { open , onClose , report, classes } = this.props ;

    const unlinkThisHLTReport = event => {
      event.preventDefault();
      Meteor.call('hlt-reports.remove', report._id, (err, res) => {
	if ( err ) console.error( err ) ;
	else {
	  console.log(`HLT report #${report._id} unlinkd.`)
	  onClose();
	}
      });
    };

    return (
	<Dialog
	  open={open}
	  onClose={onClose}
	  component="form"
	  aria-labelledby="hlt-report-unlinking-dialog-title"
	>
	  <DialogTitle id="hlt-report-unlinking-dialog-title">Unlink HLT report {report._id}</DialogTitle>
	  <DialogContent>
	    <DialogContentText>
	      If you do not want to unlink this HLT report, click cancel.
	      If you really want to unlink this HLT report from the system, click the unlink button.
	    </DialogContentText>
	  </DialogContent>
	  <DialogActions>
	    <Button type="submit" onClick={onClose} color="default">
	      Cancel
	      <CancelIcon className={classes.rightIcon}/>
	    </Button>
	    <Button onClick={unlinkThisHLTReport} color="secondary">
	      Unlink
	      <LinkOffIcon className={classes.rightIcon}/>
	    </Button>
	  </DialogActions>
	</Dialog>
    );
  }

}

HLTReportUnlinkingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
} ;

export default withStyles(styles)(HLTReportUnlinkingDialog) ;
