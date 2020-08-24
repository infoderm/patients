import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {withStyles} from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';

import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';

import dateFormat from 'date-fns/format';

import {Patients} from '../../api/patients.js';
import {msToString} from '../../client/duration.js';

import AppointmentDeletionDialog from './AppointmentDeletionDialog.js';

const styles = (theme) => ({
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular
	},
	chips: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap'
	},
	chip: {
		marginRight: theme.spacing(1)
	},
	linksep: {
		marginRight: theme.spacing(1)
	},
	link: {
		fontWeight: 'bold'
	},
	patientchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#88f',
		color: '#fff',
		fontWeight: 'bold'
	},
	debtchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#f88',
		color: '#fff',
		fontWeight: 'bold'
	}
});

class AppointmentCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			deleting: false
		};
	}

	render() {
		const {
			patientChip,
			defaultExpanded,
			classes,
			loadingPatient,
			patient,
			appointment: {patientId, datetime, duration, reason}
		} = this.props;

		const {deleting} = this.state;

		return (
			<Accordion
				defaultExpanded={defaultExpanded}
				TransitionProps={{unmountOnExit: true}}
			>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<div className={classes.chips}>
						<Chip
							label={dateFormat(datetime, 'iii do MMMM yyyy')}
							className={classes.chip}
							component={Link}
							to={`/calendar/${dateFormat(datetime, 'yyyy-MM-dd')}`}
						/>
						<Chip
							label={dateFormat(datetime, 'hh:mma')}
							className={classes.chip}
						/>
						{duration && (
							<Chip label={msToString(duration)} className={classes.chip} />
						)}
						{!patientChip ? null : (
							<Chip
								avatar={
									!loadingPatient && patient && patient.photo ? (
										<Avatar src={`data:image/png;base64,${patient.photo}`} />
									) : null
								}
								label={
									loadingPatient
										? patientId
										: !patient
										? 'Not found'
										: `${patient.lastname} ${patient.firstname}`
								}
								className={classes.patientchip}
								component={Link}
								to={`/patient/${patientId}`}
							/>
						)}
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<List>
						<ListItem>
							<Avatar>
								<InfoIcon />
							</Avatar>
							<ListItemText primary="Motif du rendez-vous" secondary={reason} />
						</ListItem>
					</List>
				</AccordionDetails>
				<Divider />
				<AccordionActions>
					<Button
						color="secondary"
						onClick={() => this.setState({deleting: true})}
					>
						Delete
						<DeleteIcon />
					</Button>
					<AppointmentDeletionDialog
						open={deleting}
						appointment={this.props.appointment}
						onClose={() => this.setState({deleting: false})}
					/>
				</AccordionActions>
			</Accordion>
		);
	}
}

AppointmentCard.defaultProps = {
	patientChip: true,
	defaultExpanded: false
};

AppointmentCard.propTypes = {
	classes: PropTypes.object.isRequired,
	appointment: PropTypes.object.isRequired,
	patientChip: PropTypes.bool,
	defaultExpanded: PropTypes.bool
};

export default withTracker(({appointment}) => {
	const _id = appointment.patientId;
	const handle = Meteor.subscribe('patient', _id);
	if (handle.ready()) {
		const patient = Patients.findOne(_id);
		return {loadingPatient: false, patient};
	}

	return {loadingPatient: true};
})(withStyles(styles, {withTheme: true})(AppointmentCard));
