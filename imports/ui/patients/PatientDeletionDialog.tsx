import React, {useState} from 'react';

import {styled} from '@mui/material/styles';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import {blue, red} from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import withLazyOpening from '../modal/withLazyOpening';
import {PatientDocument} from '../../api/collection/patients';
import PatientSuperDeletionDialog from './PatientSuperDeletionDialog';
import StaticPatientCard from './StaticPatientCard';
import PatientDeathDateEditionDialog from './PatientDeathDateEditionDialog';

const PrimaryAvatar = styled(Avatar)({
	backgroundColor: blue[100],
	color: blue[600],
});

const SecondaryAvatar = styled(Avatar)({
	backgroundColor: red[100],
	color: red[600],
});

interface Props {
	open: boolean;
	onClose: () => void;
	patient: PatientDocument;
}

const PatientDeletionDialog = ({open, onClose, patient}: Props) => {
	const [settingDeathDate, setSettingDeathDate] = useState(false);
	const [deleting, setDeleting] = useState(false);
	return (
		<>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>
					What is wrong with patient {patient.firstname} {patient.lastname}?
				</DialogTitle>
				<DialogContent>
					<StaticPatientCard patient={patient} />
				</DialogContent>
				<List>
					<ListItem
						button
						onClick={() => {
							setSettingDeathDate(true);
							onClose();
						}}
					>
						<ListItemAvatar>
							<PrimaryAvatar>
								<HeartBrokenIcon />
							</PrimaryAvatar>
						</ListItemAvatar>
						<ListItemText primary="This patient is dead" />
					</ListItem>
					<ListItem
						button
						onClick={() => {
							setDeleting(true);
							onClose();
						}}
					>
						<ListItemAvatar>
							<SecondaryAvatar>
								<DeleteForeverIcon />
							</SecondaryAvatar>
						</ListItemAvatar>
						<ListItemText primary="This patient should not be in the database" />
					</ListItem>
				</List>
			</Dialog>
			<PatientDeathDateEditionDialog
				open={settingDeathDate}
				patient={patient}
				onClose={() => {
					setSettingDeathDate(false);
				}}
			/>
			<PatientSuperDeletionDialog
				open={deleting}
				patient={patient}
				onClose={() => {
					setDeleting(false);
				}}
			/>
		</>
	);
};

export default withLazyOpening(PatientDeletionDialog);
