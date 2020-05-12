import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {withStyles} from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import BusinessIcon from '@material-ui/icons/Business';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import BugReportIcon from '@material-ui/icons/BugReport';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import SubjectIcon from '@material-ui/icons/Subject';
import DoneIcon from '@material-ui/icons/Done';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DeleteIcon from '@material-ui/icons/Delete';
import HistoryIcon from '@material-ui/icons/History';

import dateformat from 'date-fns/format';

import {Patients} from '../../api/patients.js';

import DocumentLinkingDialog from './DocumentLinkingDialog.js';

const styles = theme => ({
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular
	},
	chips: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
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
	unlinkedpatientchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#f88',
		color: '#fff',
		fontWeight: 'bold',
	},
	linkoffchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#f88',
		color: '#fff',
	},
	anomalieschip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#fa8',
		color: '#fff',
		fontWeight: 'bold',
	},
	partialchip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#fa8',
		color: '#fff',
		fontWeight: 'bold',
	},
	completechip: {
		marginRight: theme.spacing(1),
		backgroundColor: '#8fa',
		color: '#fff',
		fontWeight: 'bold',
	},
	pre: {
		padding: theme.spacing(3),
		overflowX: 'auto',
	},
	list: {
		maxWidth: '100%',
	},
});

class DocumentCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			triedToLink: false,
			linking: false,
			deleting: false,
		};
	}

	render() {
		const {
			defaultExpanded,
			classes,
			loadingPatient,
			patient,
			document: {
				_id,
				createdAt,
				patientId,
				source,
				parsed,
				format,
				kind,
				identifier,
				reference,
				status,
				datetime,
				patient: subject,
				anomalies,
				deleted,
				lastVersion,
			},
		} = this.props;

		const { document } = this.props;

		const {
			triedToLink,
			linking,
			deleting,
		} = this.state;

		return (
			<ListItem>
				<ListItemText primary={
					<div className={classes.chips}>
						{ parsed ?
							<Chip
								label={dateformat(datetime,'iii do MMMM yyyy')}
								className={classes.chip}
							/>
							:
							<Chip
								label={dateformat(createdAt,'iii do MMMM yyyy')}
								className={classes.chip}
							/>
						}
						{ parsed &&
							<Chip
								avatar={<Avatar><BusinessIcon/></Avatar>}
								label={identifier}
								className={classes.chip}
							/>
						}
						{ parsed &&
							<Chip
								avatar={<Avatar><ConfirmationNumberIcon/></Avatar>}
								label={reference}
								className={classes.chip}
							/>
						}
						{ parsed ? null :
							<Chip
								avatar={<Avatar><BugReportIcon/></Avatar>}
								label="parsing error"
								className={classes.chip}
							/>
						}
						{ patientId &&
							<Chip
								avatar={(!loadingPatient && patient && patient.photo) ?
									<Avatar src={`data:image/png;base64,${patient.photo}`}/>
									:
									null
								}
								label={loadingPatient ? patientId : !patient ? 'Not found' : `${patient.lastname} ${patient.firstname}`}
								className={classes.patientchip}
								component={Link}
								to={`/patient/${patientId}`}
							/>
						}
						{ (!patientId && parsed) &&
							<Chip
								avatar={<Avatar><LinkOffIcon/></Avatar>}
								label={`${subject.lastname} ${subject.firstname}`}
								className={classes.unlinkedpatientchip}
								onClick={e => {
									e.stopPropagation();
									this.setState({linking: true, triedToLink: true});
								}}
							/>
						}
						{ (!patientId && !parsed) &&
							<Chip
								avatar={<Avatar><LinkOffIcon/></Avatar>}
								label="not linked"
								className={classes.linkoffchip}
								onClick={e => {
									e.stopPropagation();
									this.setState({linking: true, triedToLink: true});
								}}
							/>
						}
						{ (!patientId && triedToLink) &&
							<DocumentLinkingDialog
								open={linking}
								onClose={e => this.setState({linking: false})}
								document={document}
								existingLink={patient}
							/>
						}
						{ (parsed && kind === 'lab' && anomalies) ?
							<Chip
								avatar={<Avatar><ErrorIcon/></Avatar>}
								label={anomalies}
								className={classes.anomalieschip}
							/>
							:
							null
						}
						{ (parsed && status && status === 'partial' ) ?
							<Chip
								avatar={<Avatar><HourglassEmptyIcon/></Avatar>}
								label={status}
								className={classes.partialchip}
							/>
							:
							null
						}
						{ (parsed && status && status === 'complete' ) ?
							<Chip
								avatar={<Avatar><DoneIcon/></Avatar>}
								label={status}
								className={classes.completechip}
							/>
							:
							null
						}
						{ deleted &&
							<Chip
								avatar={<Avatar><DeleteIcon/></Avatar>}
								label="deleted"
								className={classes.chip}
							/>
						}
						{ (!deleted && !lastVersion) &&
							<Chip
								avatar={<Avatar><HistoryIcon/></Avatar>}
								label="old version"
								className={classes.chip}
							/>
						}
					</div>
				} />
				<ListItemSecondaryAction>
					<IconButton
						component={Link}
						target="_blank"
						to={`/document/${_id.toHexString ? _id.toHexString() : _id}`}
						aria-label="Open in New Tab"
					>
						<OpenInNewIcon/>
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
		);
	}
}

DocumentCard.propTypes = {
	classes: PropTypes.object.isRequired,
	document: PropTypes.object.isRequired
};

export default withTracker(({document}) => {
	const _id = document.patientId;
	if (!_id) return {loadingPatient: false};
	const handle = Meteor.subscribe('patient', _id);
	if (handle.ready()) {
		const patient = Patients.findOne(_id);
		return {loadingPatient: false, patient};
	}
	return {loadingPatient: true};
})(withStyles(styles, {withTheme: true})(DocumentCard));
