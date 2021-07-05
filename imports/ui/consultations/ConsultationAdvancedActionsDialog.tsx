import React, {useState} from 'react';

import {makeStyles} from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';
import RestoreIcon from '@material-ui/icons/Restore';

import {blue, red} from '@material-ui/core/colors';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import AppointmentDeletionDialog from '../appointments/AppointmentDeletionDialog';
import StaticConsultationCardChips from './StaticConsultationCardChips';
import ConsultationDeletionDialog from './ConsultationDeletionDialog';
import ConsultationAppointmentRestorationDialog from './ConsultationAppointmentRestorationDialog';

const useStyles = makeStyles({
	primary: {
		backgroundColor: blue[100],
		color: blue[600]
	},
	secondary: {
		backgroundColor: red[100],
		color: red[600]
	}
});

const ConsultationAdvancedActionsDialog = (props) => {
	const classes = useStyles();

	const {open, onClose, ...rest} = props;
	const {consultation} = rest;
	const {isDone, scheduledDatetime} = consultation;
	const [deleting, setDeleting] = useState(false);
	const [restoreAppointment, setRestoreAppointment] = useState(false);

	return (
		<>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>What do you want to do?</DialogTitle>
				<DialogContent>
					<StaticConsultationCardChips
						{...rest}
						showDate
						showTime
						showPrice
						PatientChip={ReactivePatientChip}
					/>
				</DialogContent>
				<List>
					{isDone && scheduledDatetime && (
						<ListItem
							button
							onClick={() => {
								setRestoreAppointment(true);
								onClose();
							}}
						>
							<ListItemAvatar>
								<Avatar className={classes.primary}>
									<RestoreIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Restore original appointment" />
						</ListItem>
					)}
					<ListItem
						button
						onClick={() => {
							setDeleting(true);
							onClose();
						}}
					>
						<ListItemAvatar>
							<Avatar className={classes.secondary}>
								<DeleteIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={
								isDone ? 'Delete this consultation' : 'Delete this appointment'
							}
						/>
					</ListItem>
				</List>
			</Dialog>
			{isDone ? (
				<ConsultationDeletionDialog
					open={deleting}
					consultation={consultation}
					onClose={() => {
						setDeleting(false);
					}}
				/>
			) : (
				<AppointmentDeletionDialog
					open={deleting}
					appointment={consultation}
					onClose={() => {
						setDeleting(false);
					}}
				/>
			)}

			{isDone && scheduledDatetime && (
				<ConsultationAppointmentRestorationDialog
					open={restoreAppointment}
					consultation={props.consultation}
					onClose={() => {
						setRestoreAppointment(false);
					}}
				/>
			)}
		</>
	);
};

export default ConsultationAdvancedActionsDialog;
