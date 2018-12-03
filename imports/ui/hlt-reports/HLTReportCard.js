import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import {withStyles} from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import AlarmIcon from '@material-ui/icons/Alarm';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import BusinessIcon from '@material-ui/icons/Business';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import BookIcon from '@material-ui/icons/Book';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import BugReportIcon from '@material-ui/icons/BugReport';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import TableChartIcon from '@material-ui/icons/TableChart';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import format from 'date-fns/format';

import {Patients} from '../../api/patients.js';

import HLTReportDeletionDialog from './HLTReportDeletionDialog.js';
import HLTReportLinkingDialog from './HLTReportLinkingDialog.js';
import HLTReportUnlinkingDialog from './HLTReportUnlinkingDialog.js';
import HLTReportTable from './HLTReportTable.js';

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
	linkoffchip: {
		marginRight: theme.spacing.unit,
		backgroundColor: '#f88',
		color: '#fff',
	},
	anomalieschip: {
		marginRight: theme.spacing.unit,
		backgroundColor: '#fa8',
		color: '#fff',
		fontWeight: 'bold',
	},
	pre: {
		padding: theme.spacing.unit * 3,
		overflowX: 'auto',
	},
	list: {
		maxWidth: '100%',
	},
});

class HLTReportCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			linking: false,
			unlinking: false,
			deleting: false,
		};
	}

	render() {
		const {
			defaultExpanded,
			classes,
			loadingPatient,
			patient,
			report: {
				_id,
				createdAt,
				patientId,
				raw,
				parsed,
				lab,
				reference,
				datetime,
				subject,
				anomalies,
			},
		} = this.props;

		const { report } = this.props;

		const {
			linking,
			unlinking,
			deleting,
		} = this.state;

		return (
			<ExpansionPanel defaultExpanded={defaultExpanded}>
				<ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
					<div className={classes.chips}>
						{ parsed ?
							<Chip
								label={format(datetime,'dddd Do MMMM YYYY')}
								className={classes.chip}
							/>
							:
							<Chip
								label={format(createdAt,'dddd Do MMMM YYYY')}
								className={classes.chip}
							/>
						}
						{ parsed &&
							<Chip
								avatar={<Avatar><BusinessIcon/></Avatar>}
								label={lab}
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
								avatar={<Avatar><FaceIcon/></Avatar>}
								label={`${subject.lastname} ${subject.firstname}`}
								className={classes.patientchip}
							/>
						}
						{ (parsed && anomalies) &&
							<Chip
								avatar={<Avatar><ErrorIcon/></Avatar>}
								label={anomalies}
								className={classes.anomalieschip}
							/>
						}
						{ patientId ? null :
							<Chip
								avatar={<Avatar><LinkOffIcon/></Avatar>}
								label="not linked"
								className={classes.linkoffchip}
							/>
						}
					</div>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
				  <List className={classes.list}>
					{ parsed &&
						<ListItem>
							<Avatar><TableChartIcon/></Avatar>
							<ListItemText
								disableTypography={true}
								primary={<Typography variant="subtitle1">Results</Typography>}
								secondary={<HLTReportTable report={report}/>}
							/>
						</ListItem>
					}
					{ (true) &&
						<ListItem>
							<Avatar><FileCopyIcon/></Avatar>
							<ListItemText
								disableTypography={true}
								primary={<Typography variant="subtitle1">Raw text</Typography>}
								secondary={
									<Paper>
										<pre className={classes.pre}>
											{raw}
										</pre>
									</Paper>
								}
							/>
						</ListItem>
					}
				  </List>
				</ExpansionPanelDetails>
				<Divider/>
				<ExpansionPanelActions>
					<Button color="primary" onClick={e => this.setState({linking: true})}>
						Link<LinkIcon/>
					</Button>
					{ patientId &&
						<Button color="secondary" onClick={e => this.setState({unlinking: true})}>
							Unlink<LinkOffIcon/>
						</Button>
					}
					<Button color="secondary" onClick={e => this.setState({deleting: true})}>
						Delete<DeleteIcon/>
					</Button>
					<HLTReportDeletionDialog
						open={linking}
						onClose={e => this.setState({linking: false})}
						report={report}
					/>
					<HLTReportDeletionDialog
						open={unlinking}
						onClose={e => this.setState({unlinking: false})}
						report={report}
					/>
					<HLTReportDeletionDialog
						open={deleting}
						onClose={e => this.setState({deleting: false})}
						report={report}
					/>
				</ExpansionPanelActions>
			</ExpansionPanel>
		);
	}
}

HLTReportCard.propTypes = {
	classes: PropTypes.object.isRequired,
	report: PropTypes.object.isRequired
};

export default withTracker(({report}) => {
	const _id = report.patientId;
	if (!_id) return {loadingPatient: false};
	const handle = Meteor.subscribe('patient', _id);
	if (handle.ready()) {
		const patient = Patients.findOne(_id);
		return {loadingPatient: false, patient};
	}
	return {loadingPatient: true};
})(withStyles(styles, {withTheme: true})(HLTReportCard));
