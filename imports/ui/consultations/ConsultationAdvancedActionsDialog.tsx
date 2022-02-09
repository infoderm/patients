import React, {useState} from 'react';

import {styled} from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import LinkOffIcon from '@mui/icons-material/LinkOff';

import {blue, red} from '@mui/material/colors';

import ReactivePatientChip from '../patients/ReactivePatientChip';

import AppointmentDeletionDialog from '../appointments/AppointmentDeletionDialog';
import StaticConsultationCardChips, {
	StaticConsultationCardChipsProps,
} from './StaticConsultationCardChips';
import ConsultationDeletionDialog from './ConsultationDeletionDialog';
import ConsultationAppointmentRestorationDialog from './ConsultationAppointmentRestorationDialog';
import ConsultationTransferDialog from './ConsultationTransferDialog';

const PREFIX = 'ConsultationAdvancedActionsDialog';

const classes = {
	primary: `${PREFIX}-primary`,
	secondary: `${PREFIX}-secondary`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
	[`& .${classes.primary}`]: {
		backgroundColor: blue[100],
		color: blue[600],
	},
	[`& .${classes.secondary}`]: {
		backgroundColor: red[100],
		color: red[600],
	},
});

interface Props extends StaticConsultationCardChipsProps {
	open: boolean;
	onClose: () => void;
}

const ConsultationAdvancedActionsDialog = ({open, onClose, ...rest}: Props) => {
	const {consultation} = rest;
	const {isDone, scheduledDatetime} = consultation;
	const [deleting, setDeleting] = useState(false);
	const [restoreAppointment, setRestoreAppointment] = useState(false);
	const [transferring, setTransferring] = useState(false);

	return (
		<Root>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>What is the problem?</DialogTitle>
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
								<Avatar className={classes.secondary}>
									<RestoreIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="This consultation should not have been started yet" />
						</ListItem>
					)}
					<ListItem
						button
						onClick={() => {
							setTransferring(true);
							onClose();
						}}
					>
						<ListItemAvatar>
							<Avatar className={classes.secondary}>
								<LinkOffIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={
								isDone
									? 'This consultation is tied to the wrong patient'
									: 'This appointment is tied to the wrong patient'
							}
						/>
					</ListItem>
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
								isDone
									? 'This consultation is a duplicate'
									: 'This appointment is a duplicate'
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
					consultation={consultation}
					onClose={() => {
						setRestoreAppointment(false);
					}}
				/>
			)}
			<ConsultationTransferDialog
				open={transferring}
				consultation={consultation}
				onClose={() => {
					setTransferring(false);
				}}
			/>
		</Root>
	);
};

export default ConsultationAdvancedActionsDialog;
