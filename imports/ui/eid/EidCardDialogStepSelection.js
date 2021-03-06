import React, {useState, useEffect} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import {fade} from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import LinearProgress from '@material-ui/core/LinearProgress';

import Typography from '@material-ui/core/Typography';
import {Alert, AlertTitle} from '@material-ui/lab';

import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';

import Button from '@material-ui/core/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import SearchBox from '../input/SearchBox';

import mergeFields from '../../util/mergeFields';

import {patients, usePatientsFind} from '../../api/patients';
import {onlyNumeric} from '../../api/string';

import dialog from '../modal/dialog';
import InformationDialog from '../modal/InformationDialog';

import makePatientsSuggestions from '../patients/makePatientsSuggestions';
import GenericStaticPatientCard from '../patients/GenericStaticPatientCard';
import SelectablePatientCard from '../patients/SelectablePatientCard';
import ReactivePatientCard from '../patients/ReactivePatientCard';
import GenericNewPatientCard from '../patients/GenericNewPatientCard';
import PatientsGrid from '../patients/PatientsGrid';

const DEFAULT_LIMIT = 3;
const DEFAULT_FIELDS = {
	...SelectablePatientCard.projection,
	// We fetch the picture through a dedicated subscription to get live
	// updates while avoiding double loading on init.
	photo: 0
};

const usePatientsNnSearch = ({niss: nn}) => {
	const query = {niss: nn};
	const limit = DEFAULT_LIMIT;
	const sort = {}; // TODO sort by something !== niss
	const fields = mergeFields(
		{
			_id: 1,
			niss: 1
		},
		sort,
		DEFAULT_FIELDS
	);
	const options = {
		fields,
		sort,
		limit
	};
	return usePatientsFind(query, options, [nn]);
};

const usePatientsNormalizedNameSearch = ({normalizedName}) => {
	const query = {normalizedName};
	const limit = DEFAULT_LIMIT;
	const sort = {}; // TODO sort by something !== normalizedName
	const fields = mergeFields(
		{
			_id: 1,
			normalizedName: 1
		},
		sort,
		DEFAULT_FIELDS
	);
	const options = {
		fields,
		sort,
		limit
	};
	return usePatientsFind(query, options, [normalizedName]);
};

const useStyles = makeStyles((theme) => ({
	expandButton: {},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},

	searchBox: {
		background: fade(theme.palette.primary.light, 0.15),
		'&:hover': {
			background: fade(theme.palette.primary.light, 0.25)
		}
	}
}));

const EidCardDialogStepSelection = ({
	onClose,
	onNext,
	eidInfo,
	selected,
	setSelected
}) => {
	const classes = useStyles();

	const eidPatient = {_id: '?', ...patients.sanitize(eidInfo)};

	const [patientSearchInput, setPatientSearchinput] = useState(
		eidPatient.normalizedName
	);

	const {loading: loadingNnMatches, results: nnMatches} =
		usePatientsNnSearch(eidPatient);

	const {
		loading: loadingNormalizedNameMatches,
		results: normalizedNameMatches
	} = usePatientsNormalizedNameSearch(eidPatient);

	const usePatientsNameSearch = makePatientsSuggestions(nnMatches, {
		fields: DEFAULT_FIELDS,
		limit: DEFAULT_LIMIT
	});

	const [nameMatchesExpanded, setNameMatchesExpanded] = useState(false);

	const noNnMatch = !loadingNnMatches && nnMatches.length === 0;
	const noNormalizedNameMatch =
		!loadingNormalizedNameMatches && normalizedNameMatches.length === 0;
	const noExactMatch = noNnMatch && noNormalizedNameMatch;

	useEffect(() => {
		if (noExactMatch) {
			setNameMatchesExpanded(true);
		}
	}, [noExactMatch]);

	const {results: nameMatches} = usePatientsNameSearch(patientSearchInput);

	const displayLinearProgress = loadingNnMatches;

	const selection = selected.size > 0;
	const selectionIsSingle = selected.size === 1;
	const selectionIsValid = selectionIsSingle;

	const onReset = () => setSelected(new Set());

	const eidPatients = [eidPatient];

	const onCardClick = ({_id}) => {
		if (selected.has(_id)) {
			const newSelected = new Set(selected);
			newSelected.delete(_id);
			setSelected(newSelected);
		} else if (selected.size === 1) {
			dialog((resolve) => (
				<InformationDialog
					title="Attention!"
					text={
						<>
							Il n&apos;est pour le moment{' '}
							<strong>pas possible de fusionner</strong> plusieurs dossiers via
							ce dialogue. Choisissez <strong>un seul dossier</strong> à éditer
							ou mettre à jour. Vous pouvez ensuite utiliser la fonctionalité{' '}
							<i>merge</i> si vous souhaitez fusionner ce dossier avec un autre.
							Si vous souhaitez reinitialiser la selection du dossier, cliquez
							sur le bouton <i>reset</i> du dialogue précédent.
						</>
					}
					close="OK"
					CloseIcon={DoneIcon}
					onClose={() => {
						resolve();
					}}
				/>
			));
		} else {
			const newSelected = new Set(selected);
			newSelected.add(_id);
			setSelected(newSelected);
		}
	};

	const getCardProps = (patient) => ({
		highlightNn: !patient.niss
			? orange[200]
			: eidPatient.niss === patient.niss
			? green[200]
			: eidPatient.niss?.startsWith(onlyNumeric(patient.niss))
			? false
			: red[200]
	});

	return (
		<>
			{displayLinearProgress && <LinearProgress />}
			<DialogTitle id="simple-dialog-title">
				Select record to work with.
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={3} justify="center" alignItems="center">
					<Grid item xs={12}>
						<DialogContentText>
							We have parsed the information on the eid card of the patient.
							Below you can find what information has been extracted.
						</DialogContentText>
					</Grid>
					<Grid item xs={12}>
						<PatientsGrid
							patients={eidPatients}
							Card={GenericStaticPatientCard}
							CardProps={{square: true, elevation: 0}}
						/>
					</Grid>
					<Grid item xs={12}>
						<DialogContentText>
							You can either update an existing patient record, merge several
							ones, or create a new one. First, select all records you would
							like to work with. Then, click next.
						</DialogContentText>
					</Grid>
					{!loadingNnMatches && (
						<>
							{noExactMatch && (
								<Grid item xs={12}>
									<Alert severity="warning">
										<AlertTitle>No exact match</AlertTitle>
										No record matches national number or name{' '}
										<strong>exactly</strong> :-(
										<br />
										Try to search for a name match manually below.
									</Alert>
								</Grid>
							)}
							{!noNnMatch && (
								<>
									<Grid item xs={12}>
										<Typography variant="h5">
											Exact matches on national number
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<PatientsGrid
											patients={nnMatches}
											Card={ReactivePatientCard}
											CardProps={{
												Card: SelectablePatientCard,
												onClick: onCardClick
											}}
											getCardProps={getCardProps}
											selected={selected}
										/>
									</Grid>
								</>
							)}
							{!noNormalizedNameMatch && (
								<>
									<Grid item xs={12}>
										<Typography variant="h5">
											Exact matches on (normalized) name
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<PatientsGrid
											patients={normalizedNameMatches}
											Card={ReactivePatientCard}
											CardProps={{
												Card: SelectablePatientCard,
												onClick: onCardClick
											}}
											getCardProps={getCardProps}
											selected={selected}
										/>
									</Grid>
								</>
							)}
							{!noExactMatch && (
								<Grid item>
									<Button
										className={classes.expandButton}
										classes={{
											endIcon: classNames(classes.expand, {
												[classes.expandOpen]: nameMatchesExpanded
											})
										}}
										aria-expanded={nameMatchesExpanded}
										aria-label="show more"
										endIcon={<ExpandMoreIcon />}
										onClick={() => setNameMatchesExpanded(!nameMatchesExpanded)}
									>
										{`Show ${nameMatchesExpanded ? 'less' : 'more'} options`}
									</Button>
								</Grid>
							)}
							<Grid item xs={12}>
								<Collapse in={nameMatchesExpanded} timeout="auto">
									<Grid
										container
										spacing={3}
										justify="center"
										alignItems="center"
									>
										<Grid item xs={12}>
											<Typography variant="h5">
												Approximate matches on patient&apos;s name
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<SearchBox
												className={classes.searchBox}
												value={patientSearchInput}
												onChange={(event) =>
													setPatientSearchinput(event.target.value)
												}
											/>
										</Grid>
										<Grid item xs={12}>
											<PatientsGrid
												patients={nameMatches}
												Card={ReactivePatientCard}
												CardProps={{
													Card: SelectablePatientCard,
													onClick: onCardClick
												}}
												getCardProps={getCardProps}
												selected={selected}
											/>
										</Grid>
										<Grid item xs={12}>
											<Typography variant="h5">
												Create a new patient from eid
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<SelectablePatientCard
												patient={{_id: '?'}}
												Card={GenericNewPatientCard}
												selected={
													selected?.size ? selected.has('?') : undefined
												}
												onClick={onCardClick}
											/>
										</Grid>
									</Grid>
								</Collapse>
							</Grid>
						</>
					)}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					type="submit"
					color="default"
					endIcon={<CancelIcon />}
					onClick={onClose}
				>
					Cancel
				</Button>
				<Button
					disabled={!selection}
					endIcon={<CancelOutlinedIcon />}
					onClick={onReset}
				>
					Reset
				</Button>
				<Button
					disabled={!selectionIsValid}
					color="primary"
					endIcon={<ArrowForwardIcon />}
					onClick={onNext}
				>
					{`Next (${selected.size})`}
				</Button>
			</DialogActions>
		</>
	);
};

export default EidCardDialogStepSelection;
