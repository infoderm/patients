import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

function ConsultationCard(props) {

  const {
    classes ,
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
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
	<Typography className={classes.heading}>Consultation on {datetime.toLocaleString()} for patient {patientId}</Typography>
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

export default withStyles(styles)(ConsultationCard);
