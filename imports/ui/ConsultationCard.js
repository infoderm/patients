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
  const { classes , consultation : { datetime , report , patientId } } = props;
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
	<Typography className={classes.heading}>Consultation on {datetime.toLocaleString()} for patient {patientId}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
	<Typography>{report}</Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

ConsultationCard.propTypes = {
  classes: PropTypes.object.isRequired,
  consultation: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConsultationCard);
