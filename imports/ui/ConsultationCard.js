import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';

import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import { Patients } from '../api/patients.js';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

function ConsultationCard(props) {

  const {
    classes ,
    loadingPatient ,
    patient ,
    consultation : {
      patientId,
      datetime,
      reason,
      done,
      todo,
      treatment,
      next,
      more,
    } ,
  } = props;

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
	<div>
	  <Chip label={datetime.toLocaleString()} className={classes.chip}/>
	  <Chip label={loadingPatient ? patientId : !patient ? 'Not found' : `${patient.firstname} ${patient.lastname}`} className={classes.chip}/>
	</div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
	<div>
	<Typography variant="title">Motif de la consultation</Typography>
	<Typography variant='body1'>{reason}</Typography>
	<Typography variant="title">Examens réalisés</Typography>
	<Typography variant='body1'>{done}</Typography>
	<Typography variant="title">Examens à réaliser</Typography>
	<Typography variant='body1'>{todo}</Typography>
	<Typography variant="title">Traitement</Typography>
	<Typography variant='body1'>{treatment}</Typography>
	<Typography variant="title">À revoir</Typography>
	<Typography variant='body1'>{next}</Typography>
	<Typography variant="title">Autres remarques</Typography>
	<Typography variant='body1'>{more}</Typography>
      </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

ConsultationCard.propTypes = {
  classes: PropTypes.object.isRequired,
  consultation: PropTypes.object.isRequired,
};


export default withTracker(({consultation}) => {
	const _id = consultation.patientId;
	const handle = Meteor.subscribe('patient', _id);
	if ( handle.ready() ) {
		const patient = Patients.findOne(_id);
		return { loadingPatient: false, patient } ;
	}
	else return { loadingPatient: true } ;
}) ( withStyles(styles, { withTheme: true})(ConsultationCard) ) ;
