import {Meteor} from 'meteor/meteor';

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import LinkIcon from '@material-ui/icons/Link';
import CancelIcon from '@material-ui/icons/Cancel';

import {patients, usePatientsAdvancedFind} from '../../api/patients.js';
import {normalizeSearch} from '../../api/string.js';

import SetPicker from '../input/SetPicker.js';

const useSuggestions = (searchString) => {
	const $search = normalizeSearch(searchString);
	const limit = 5;

	const query = {$text: {$search}};

	const sort = {
		score: {$meta: 'textScore'}
	};
	const fields = {
		...sort,
		_id: 1,
		firstname: 1,
		lastname: 1
	};

	const options = {
		fields,
		sort,
		skip: 0,
		limit
	};

	return usePatientsAdvancedFind(query, options, [
		$search
		// refreshKey,
	]);
};

const useStyles = makeStyles((theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	},
	dialogPaper: {
		overflow: 'visible'
	}
}));

const DocumentLinkingDialog = ({open, onClose, document, existingLink}) => {
	const classes = useStyles();

	const [patient, setPatient] = useState(existingLink ? [existingLink] : []);

	const linkThisDocument = (event) => {
		event.preventDefault();
		const documentId = document._id;
		const patientId = patient[0]._id;
		Meteor.call('documents.link', documentId, patientId, (err, _res) => {
			if (err) {
				console.error(err);
			} else {
				console.log(`Document #${documentId} linked to patient #${patientId}.`);
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
					If you do not want to link this document, click cancel. If you really
					want to link this document, enter the name of the patient to link it
					to and click the link button.
				</DialogContentText>
				<SetPicker
					itemToKey={patients.toKey}
					itemToString={patients.toString}
					useSuggestions={useSuggestions}
					TextFieldProps={{
						autoFocus: true,
						label: 'Patient to link document to',
						margin: 'normal'
					}}
					value={patient}
					maxCount={1}
					onChange={(e) => setPatient(e.target.value)}
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
};

DocumentLinkingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	document: PropTypes.object,
	existingLink: PropTypes.object
};

DocumentLinkingDialog.projection = {
	_id: 1
};

export default DocumentLinkingDialog;
