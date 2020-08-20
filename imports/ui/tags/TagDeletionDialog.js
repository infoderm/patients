import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '../modal/OptimizedDialog.js';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import {normalized} from '../../api/string.js';

const styles = (theme) => ({
	rightIcon: {
		marginLeft: theme.spacing(1)
	}
});

const MAGIC = '8324jdkf-tag-deletion-dialog-title';
let nextAriaId = 0;

class TagDeletionDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			nameError: '',
			ariaId: `${MAGIC}-#${++nextAriaId}`
		};
	}

	render() {
		const {classes, open, onClose, title, method, tag} = this.props;
		const {name, nameError, ariaId} = this.state;

		const Title = title[0].toUpperCase() + title.slice(1);

		const deleteThisTagIfNameMatches = (event) => {
			event.preventDefault();
			if (normalized(name) === normalized(tag.name)) {
				this.setState({nameError: ''});
				Meteor.call(method, tag._id, (err, _res) => {
					if (err) {
						console.error(err);
					} else {
						console.log(`${Title} #${tag._id} deleted (using ${method}).`);
						onClose();
					}
				});
			} else {
				this.setState({nameError: 'Names do not match'});
			}
		};

		return (
			<Dialog
				open={open}
				component="form"
				aria-labelledby={ariaId}
				onClose={onClose}
			>
				<DialogTitle id={ariaId}>
					Delete {title} {tag.name}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						If you do not want to delete this {title}, click cancel. If you
						really want to delete this {title} from the system, enter the{' '}
						{title}&apos;s name below and click the delete button.
					</DialogContentText>
					<TextField
						autoFocus
						fullWidth
						margin="dense"
						label={`${Title}'s name`}
						value={name}
						helperText={nameError}
						error={Boolean(nameError)}
						onChange={(e) => this.setState({name: e.target.value})}
					/>
				</DialogContent>
				<DialogActions>
					<Button type="submit" color="default" onClick={onClose}>
						Cancel
						<CancelIcon className={classes.rightIcon} />
					</Button>
					<Button color="secondary" onClick={deleteThisTagIfNameMatches}>
						Delete
						<DeleteIcon className={classes.rightIcon} />
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

TagDeletionDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired,
	tag: PropTypes.object.isRequired
};

export default withStyles(styles)(TagDeletionDialog);
