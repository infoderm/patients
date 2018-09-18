import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import DoneIcon from '@material-ui/icons/Done';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import AlarmIcon from '@material-ui/icons/Alarm';
import WarningIcon from '@material-ui/icons/Warning';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import BookIcon from '@material-ui/icons/Book';
import AttachmentIcon from '@material-ui/icons/Attachment';

import { format } from 'date-fns' ;

import Currency from 'currency-formatter' ;

import ConsultationDeletionDialog from './ConsultationDeletionDialog.js';
import AttachFileButton from './AttachFileButton.js';
import AttachmentLink from './AttachmentLink.js';

import { Patients } from '../api/patients.js';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  } ,
  chip: {
    marginRight: theme.spacing.unit,
  },
  linksep: {
    marginRight: theme.spacing.unit,
  },
  link: {
    fontWeight: 'bold',
  },
  patientchip: {
    marginRight: theme.spacing.unit,
    backgroundColor: '#88f',
    color: '#fff',
    fontWeight: 'bold',
  },
  debtchip: {
    marginRight: theme.spacing.unit,
    backgroundColor: '#f88',
    color: '#fff',
    fontWeight: 'bold',
  },
});

class ConsultationCard extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      deleting: false,
    };
  }

  render () {

    const {
      defaultExpanded,
      classes ,
      loadingPatient ,
      patient ,
      consultation : {
	_id,
	patientId,
	datetime,
	reason,
	done,
	todo,
	treatment,
	next,
	more,
	currency,
	price,
	paid,
	book,
	attachments,
      } ,
    } = this.props;

    const { deleting } = this.state;

    return (
      <ExpansionPanel defaultExpanded={defaultExpanded}>
	<ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
	  <div className={classes.chips}>
	    <Chip label={format(datetime,'dddd Do MMMM YYYY')} className={classes.chip} component={Link} to={`/calendar/${format(datetime,'YYYY-MM-DD')}`}/>
	    <Chip label={format(datetime,'hh:mmA')} className={classes.chip}/>
	    <Chip avatar={(!loadingPatient && patient && patient.photo) ? <Avatar src={`data:image/png;base64,${patient.photo}`}/> : null} label={loadingPatient ? patientId : !patient ? 'Not found' : `${patient.lastname} ${patient.firstname}`} className={classes.patientchip} component={Link} to={`/patient/${patientId}`}/>
	    { attachments === undefined || attachments.length === 0 ? '' :
	      <Chip
		avatar={<Avatar><AttachmentIcon/></Avatar>}
		label={attachments.length}
		className={classes.chip}
	      />
	    }
	    { currency === undefined || price === undefined || paid === undefined || paid === price ? '' : <Chip label={`Doit ${Currency.format(price-paid, {code: currency})}`} className={classes.debtchip}/> }
	  </div>
	</ExpansionPanelSummary>
	<ExpansionPanelDetails>
	  <List>
	    <ListItem>
	      <Avatar><InfoIcon/></Avatar>
	      <ListItemText primary="Motif de la consultation" secondary={reason}/>
	    </ListItem>
	    <ListItem>
	      <Avatar><DoneIcon/></Avatar>
	      <ListItemText primary="Examens déjà réalisés" secondary={done}/>
	    </ListItem>
	    <ListItem>
	      <Avatar><HourglassFullIcon/></Avatar>
	      <ListItemText primary="Examens à réaliser" secondary={todo}/>
	    </ListItem>
	    <ListItem>
	      <Avatar><EditIcon/></Avatar>
	      <ListItemText primary="Traitement" secondary={treatment}/>
	    </ListItem>
	    <ListItem>
	      <Avatar><AlarmIcon/></Avatar>
	      <ListItemText primary="À revoir" secondary={next}/>
	    </ListItem>
	    <ListItem>
	      <Avatar><WarningIcon/></Avatar>
	      <ListItemText primary="Autres remarques" secondary={more}/>
	    </ListItem>
	    { currency === undefined || price === undefined  || paid === undefined ? '' :
	    <ListItem>
	      <Avatar><EuroSymbolIcon/></Avatar>
	      <ListItemText primary="Paiement" secondary={`À payé ${Currency.format(paid, {code: currency})} de ${Currency.format(price, {code: currency})}.`}/>
	    </ListItem> }
	    { book === '' ? '' :
	    <ListItem>
	      <Avatar><BookIcon/></Avatar>
	      <ListItemText primary="Carnet" secondary={book}/>
	    </ListItem> }
	    { attachments === undefined || attachments.length === 0 ? '' :
	    <ListItem>
	      <Avatar><AttachmentIcon/></Avatar>
	      <ListItemText
		primary={`${attachments.length} attachments`}
		secondary={
		  attachments.map(
		    (attachmentId, i) => (
		      <React.Fragment key={attachmentId}>
			{!!i && <span className={classes.linksep}>,</span>}
			<AttachmentLink className={classes.link} attachmentId={attachmentId}/>
		      </React.Fragment>
		    )
		  )
		}
	      />
	    </ListItem> }
	  </List>
	</ExpansionPanelDetails>
	    <Divider/>
	<ExpansionPanelActions>
	  <Button color="primary" component={Link} to={`/edit/consultation/${_id}`}>
	    Edit<EditIcon/>
	  </Button>
	  <AttachFileButton color="primary" method="consultations.attach" item={_id}/>
	  <Button color="secondary" onClick={e => this.setState({ deleting: true})}>
	    Delete<DeleteIcon/>
	  </Button>
	  {(loadingPatient || !patient) ? '':
	  <ConsultationDeletionDialog open={deleting} onClose={e => this.setState({ deleting: false})} consultation={this.props.consultation} patient={patient}/>
	  }
	</ExpansionPanelActions>
      </ExpansionPanel>
    );
  }

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
