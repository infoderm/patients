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
import Typography from '@material-ui/core/Typography';

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
import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import BookIcon from '@material-ui/icons/Book';
import AttachmentIcon from '@material-ui/icons/Attachment';
import SmartphoneIcon from '@material-ui/icons/Smartphone';

import dateFormat from 'date-fns/format' ;

import Currency from 'currency-formatter' ;

import ConsultationPaymentDialog from './ConsultationPaymentDialog.js';
import ConsultationDebtSettlementDialog from './ConsultationDebtSettlementDialog.js';
import ConsultationDeletionDialog from './ConsultationDeletionDialog.js';

import AttachFileButton from '../attachments/AttachFileButton.js';
import AttachmentLink from '../attachments/AttachmentLink.js';

import { Patients } from '../../api/patients.js';

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
    marginRight: theme.spacing(1),
  },
  linksep: {
    marginRight: theme.spacing(1),
  },
  link: {
    fontWeight: 'bold',
  },
  patientchip: {
    marginRight: theme.spacing(1),
    backgroundColor: '#88f',
    color: '#fff',
    fontWeight: 'bold',
  },
  pricechip: {
    marginRight: theme.spacing(1),
    backgroundColor: '#228d57',
    color: '#e8e9c9',
    fontWeight: 'bold',
  },
  debtchip: {
    marginRight: theme.spacing(1),
    backgroundColor: '#f88',
    color: '#fff',
    fontWeight: 'bold',
  },
});

class ConsultationCard extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      paying: false,
      settling: false,
      deleting: false,
    };
  }

  render () {

    const {
      patientChip,
      showPrice,
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
	payment_method,
	price,
	paid,
	book,
	attachments,
      } ,
    } = this.props;

    const { paying, settling , deleting } = this.state;

    const missingPaymentData = currency === undefined || price === undefined || paid === undefined;
    const owes = ! (missingPaymentData || paid === price) ;
    const owed = owes ? price - paid : 0 ;

    return (
      <ExpansionPanel defaultExpanded={defaultExpanded}>
	<ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
	  <div className={classes.chips}>
	    <Chip label={dateFormat(datetime,'iii do MMMM yyyy')} className={classes.chip} component={Link} to={`/calendar/${dateFormat(datetime,'yyyy-MM-dd')}`}/>
	    <Chip label={dateFormat(datetime,'hh:mma')} className={classes.chip}/>
	    { !patientChip ? null :
	      <Chip
	      avatar={(!loadingPatient && patient && patient.photo) ? <Avatar src={`data:image/png;base64,${patient.photo}`}/> : null}
	      label={loadingPatient ? patientId : !patient ? 'Not found' : `${patient.lastname} ${patient.firstname}`}
	      className={classes.patientchip}
	      component={Link}
	      to={`/patient/${patientId}`}
	      />
	    }
	    { attachments === undefined || attachments.length === 0 ? '' :
	      <Chip
		avatar={<Avatar><AttachmentIcon/></Avatar>}
		label={attachments.length}
		className={classes.chip}
	      />
	    }
	    { !missingPaymentData && showPrice &&
	      <Chip
		className={classes.pricechip}
		avatar={<Avatar>{ payment_method === 'wire' ? <PaymentIcon/> : <MoneyIcon/> }</Avatar>}
		label={Currency.format(price, {code: currency})}
	      />
	    }
	    { owes && <Chip label={`Doit ${Currency.format(owed, {code: currency})}`} className={classes.debtchip}/> }
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
	    { missingPaymentData ? '' :
	    <ListItem>
	      <Avatar><EuroSymbolIcon/></Avatar>
	      <ListItemText
		primary="Paiement"
		secondary={`À payé ${Currency.format(paid, {code: currency})} de ${Currency.format(price, {code: currency})}.`}
	      />
	    </ListItem> }
	    { missingPaymentData ? '' :
	    <ListItem>
	      <Avatar><AccountBalanceWalletIcon/></Avatar>
	      <ListItemText
		primary="Méthode de Paiement"
		secondary={payment_method === 'wire' ? 'Virement' : 'Cash'}
	      />
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
		disableTypography={true}
		primary={<Typography variant="subtitle1">{attachments.length} attachments</Typography>}
		secondary={
		(<ul>{
		  attachments.map(
		    (attachmentId, i) => (
		      <li key={attachmentId}>
			<AttachmentLink className={classes.link} attachmentId={attachmentId}/>
		      </li>
		    )
		  )
		}</ul>)
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
	  { owes && (payment_method === 'wire') && <Button color="primary" onClick={e => this.setState({ paying: true})}>
	    Pay by Phone<SmartphoneIcon/>
	  </Button> }
	  { owes && <Button color="primary" onClick={e => this.setState({ settling: true})}>
	    Settle debt<EuroSymbolIcon/>
	  </Button> }
	  <AttachFileButton color="primary" method="consultations.attach" item={_id}/>
	  <Button color="secondary" onClick={e => this.setState({ deleting: true})}>
	    Delete<DeleteIcon/>
	  </Button>
	  {(!owes  || payment_method !== 'wire'|| loadingPatient || !patient) ? null :
	  <ConsultationPaymentDialog open={paying} onClose={e => this.setState({ paying: false})} consultation={this.props.consultation} patient={patient}/>
	  }
	  {(!owes || loadingPatient || !patient) ? null :
	  <ConsultationDebtSettlementDialog open={settling} onClose={e => this.setState({ settling: false})} consultation={this.props.consultation} patient={patient}/>
	  }
	  {(loadingPatient || !patient) ? null :
	  <ConsultationDeletionDialog open={deleting} onClose={e => this.setState({ deleting: false})} consultation={this.props.consultation} patient={patient}/>
	  }
	</ExpansionPanelActions>
      </ExpansionPanel>
    );
  }

}

ConsultationCard.defaultProps = {
  patientChip: true,
  showPrice: false,
  defaultExpanded: false,
} ;

ConsultationCard.propTypes = {
  classes: PropTypes.object.isRequired,
  consultation: PropTypes.object.isRequired,
  patientChip: PropTypes.bool.isRequired,
  showPrice: PropTypes.bool.isRequired,
  defaultExpanded: PropTypes.bool.isRequired,
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
