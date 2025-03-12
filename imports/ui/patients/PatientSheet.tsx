import React from 'react';

import {styled} from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';

import pngDataURL from '../../util/png/dataURL';

import SetPicker from '../input/SetPicker';
import {type PatientFields} from '../../api/collection/patients';
import {type ConsultationDocument} from '../../api/collection/consultations';
import {type DocumentDocument} from '../../api/collection/documents';
import {type AttachmentDocument} from '../../api/collection/attachments';

const PREFIX = 'PatientSheet';

const classes = {
	photoPlaceHolder: `${PREFIX}-photoPlaceHolder`,
	photo: `${PREFIX}-photo`,
	formControl: `${PREFIX}-formControl`,
	container: `${PREFIX}-container`,
	multiline: `${PREFIX}-multiline`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
	[`& .${classes.photoPlaceHolder}`]: {
		display: 'flex',
		fontSize: '4rem',
		margin: 0,
		width: 140,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff',
		backgroundColor: '#999',
		verticalAlign: 'top',
		marginRight: theme.spacing(2),
	},

	[`& .${classes.photo}`]: {
		width: 140,
		height: 200,
		verticalAlign: 'top',
		marginRight: theme.spacing(2),
	},

	[`& .${classes.formControl}`]: {
		margin: theme.spacing(1),
		overflow: 'auto',
		'& input, & div': {
			color: 'black !important',
		},
	},

	[`& .${classes.container}`]: {
		padding: theme.spacing(3),
	},

	[`& .${classes.multiline}`]: {
		margin: theme.spacing(1),
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing(2)})`,
		'& textarea': {
			color: 'black !important',
		},
	},
}));

const CustomTextField = ({value, ...rest}) => (
	<TextField
		InputLabelProps={{
			shrink: value !== '' && value !== undefined && value !== null,
		}}
		inputProps={{
			readOnly: true,
		}}
		margin="normal"
		value={value}
		{...rest}
	/>
);

const ReadOnlyTextField = (props) => {
	return <CustomTextField className={classes.formControl} {...props} />;
};

const MultilineReadOnlyTextField = (props) => {
	return <CustomTextField multiline className={classes.multiline} {...props} />;
};

const minRows = 8;
const maxRows = 100;

const LargeMultilineReadOnlyTextField = (props) => (
	<MultilineReadOnlyTextField minRows={minRows} maxRows={maxRows} {...props} />
);

const SmallMultilineReadOnlyTextField = (props) => (
	<MultilineReadOnlyTextField minRows={1} {...props} />
);

type Props = {
	readonly patient: PatientFields;
	readonly consultations: ConsultationDocument[];
	readonly attachments: AttachmentDocument[];
	readonly documents: DocumentDocument[];
};

const PatientSheet = ({
	patient,
	consultations,
	attachments,
	documents,
}: Props) => {
	return (
		<StyledPaper>
			<Grid container className={classes.container}>
				<Grid item sm={4} md={2}>
					{patient.photo ? (
						<img
							className={classes.photo}
							src={pngDataURL(patient.photo)}
							title={`${patient.firstname} ${patient.lastname}`}
						/>
					) : (
						<div className={classes.photoPlaceHolder}>
							{patient.firstname ? patient.firstname[0] : '?'}
							{patient.lastname ? patient.lastname[0] : '?'}
						</div>
					)}
				</Grid>
				<Grid item sm={8} md={10}>
					<form>
						<Grid container>
							<Grid item xs={2}>
								<ReadOnlyTextField label="NISS" value={patient.niss} />
							</Grid>
							<Grid item xs={3}>
								<ReadOnlyTextField label="Last name" value={patient.lastname} />
							</Grid>
							<Grid item xs={3}>
								<ReadOnlyTextField
									label="First name"
									value={patient.firstname}
								/>
							</Grid>
							<Grid item xs={2}>
								<ReadOnlyTextField label="Sex" value={patient.sex} />
							</Grid>
							<Grid item xs={2}>
								<ReadOnlyTextField
									label="Birth date"
									value={patient.birthdate}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<LargeMultilineReadOnlyTextField
									label="Antécédents"
									value={patient.antecedents}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<LargeMultilineReadOnlyTextField
									label="Traitement en cours"
									value={patient.ongoing}
								/>
							</Grid>

							<Grid item xs={12} md={12}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x.name}
									itemToString={(x) => x.name}
									TextFieldProps={{
										label: 'Allergies',
										margin: 'normal',
									}}
									chipProps={{
										avatar: <Avatar>Al</Avatar>,
									}}
									value={patient.allergies ?? []}
								/>
							</Grid>

							<Grid item xs={12} md={6}>
								<SmallMultilineReadOnlyTextField
									label="Rue et Numéro"
									value={patient.streetandnumber}
								/>
							</Grid>
							<Grid item xs={12} md={2}>
								<SmallMultilineReadOnlyTextField
									label="Code Postal"
									value={patient.zip}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SmallMultilineReadOnlyTextField
									label="Commune"
									value={patient.municipality}
								/>
							</Grid>

							<Grid item xs={12} md={4}>
								<SmallMultilineReadOnlyTextField
									label="Numéro de téléphone"
									value={patient.phone}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x.name}
									itemToString={(x) => x.name}
									TextFieldProps={{
										label: 'Médecin Traitant',
										margin: 'normal',
									}}
									chipProps={{
										avatar: <Avatar>Dr</Avatar>,
									}}
									value={patient.doctors ?? []}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x.name}
									itemToString={(x) => x.name}
									TextFieldProps={{
										label: 'Mutuelle',
										margin: 'normal',
									}}
									chipProps={{
										avatar: <Avatar>In</Avatar>,
									}}
									value={patient.insurances ?? []}
								/>
							</Grid>

							<Grid item xs={9}>
								<MultilineReadOnlyTextField
									minRows={2}
									maxRows={maxRows}
									label="About"
									value={patient.about}
								/>
							</Grid>
							<Grid item xs={3}>
								<MultilineReadOnlyTextField
									label="PVPP"
									value={patient.noshow ?? 0}
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x._id}
									itemToString={(x) => x._id}
									TextFieldProps={{
										label: 'Consultations',
										margin: 'normal',
									}}
									value={consultations || []}
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x._id}
									itemToString={(x) => x._id}
									TextFieldProps={{
										label: 'Documents',
										margin: 'normal',
									}}
									value={documents || []}
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<SetPicker
									readOnly
									useSuggestions={() => ({results: []})}
									itemToKey={(x) => x._id}
									itemToString={(x) => x._id}
									TextFieldProps={{
										label: 'Attachments',
										margin: 'normal',
									}}
									value={attachments || []}
								/>
							</Grid>
						</Grid>
					</form>
				</Grid>
			</Grid>
		</StyledPaper>
	);
};

export default PatientSheet;
