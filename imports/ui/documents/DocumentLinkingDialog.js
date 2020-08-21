import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import LinkIcon from '@material-ui/icons/Link';
import CancelIcon from '@material-ui/icons/Cancel';

import {Patients, patients} from '../../api/patients.js';

import SetPicker from '../input/SetPicker.js';

const styles = (theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	},
	dialogPaper: {
		overflow: 'visible'
	}
});

class DocumentLinkingDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			patient: props.existingLink ? [props.existingLink] : []
		};
	}

	render() {
		const {open, onClose, document, classes, allPatients} = this.props;

		const {patient} = this.state;

		const linkThisDocument = (event) => {
			event.preventDefault();
			const documentId = document._id;
			const patientId = patient[0]._id;
			Meteor.call('documents.link', documentId, patientId, (err, _res) => {
				if (err) {
					console.error(err);
				} else {
					console.log(
						`Document #${documentId} linked to patient #${patientId}.`
					);
					onClose();
				}
			});
		};

		return (
			<Dialog
				classes={{paper: classes.dialogPaper}}
				open={open}
				component="form"
				aria-labelledby="document-linking-dialog-title"
				onClose={onClose}
			>
				<DialogTitle id="document-linking-dialog-title">
					Link document {document._id.toString()}
				</DialogTitle>
				<DialogContent className={classes.dialogPaper}>
					<DialogContentText>
						If you do not want to link this document, click cancel. If you
						really want to link this document, enter the name of the patient to
						link it to and click the link button.
					</DialogContentText>
					<SetPicker
						suggestions={allPatients}
						itemToKey={patients.toKey}
						itemToString={patients.toString}
						filter={patients.filter}
						TextFieldProps={{
							autoFocus: true,
							label: 'Patient to link document to',
							margin: 'normal'
						}}
						value={patient}
						maxCount={1}
						onChange={(e) => this.setState({patient: e.target.value})}
					/>
				</DialogContent>
				<DialogActions>
					<Button type="submit" color="default" onClick={onClose}>
						Cancel
						<CancelIcon className={classes.rightIcon} />
					</Button>
					<Button
						disabled={patient.length === 0}
						color="secondary"
						onClick={linkThisDocument}
					>
						Link
						<LinkIcon className={classes.rightIcon} />
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	static propTypes = {
		open: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
		classes: PropTypes.object.isRequired,
		allPatients: PropTypes.array.isRequired
	};
}

const Component = withTracker(() => {
	const query = {};
	const options = {
		sort: {lastname: 1},
		fields: {
			_id: 1,
			firstname: 1,
			lastname: 1
		}
	};
	Meteor.subscribe('patients', query, options);
	return {
		allPatients: Patients.find(query, options).fetch()
	};
})(withStyles(styles, {withTheme: true})(DocumentLinkingDialog));

Component.projection = {
	_id: 1
};

export default Component;
