import React, {
	useState,
	useEffect,
	type Dispatch,
	type ReducerAction,
} from 'react';
import {useNavigate} from 'react-router-dom';

import {styled} from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';

import removeUndefined from '../../util/object/removeUndefined';
import call from '../../api/endpoint/call';

import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import useDialog from '../modal/useDialog';
import ConfirmationDialog from '../modal/ConfirmationDialog';

import FixedFab from '../button/FixedFab';

import insertConsultation from '../../api/endpoint/consultations/insert';
import updateConsultation from '../../api/endpoint/consultations/update';
import usePrompt from '../navigation/usePrompt';
import {books} from '../../api/books';
import {documentDiff} from '../../api/update';
import {parseNonNegativeIntegerStrictOrUndefined} from '../../api/string';

import ConsultationEditorHeader from './ConsultationEditorHeader';
import ConsultationForm from './ConsultationForm';
import PrecedingConsultationsList from './PrecedingConsultationsList';
import useNextInBookNumber from './useNextInBookNumber';
import useConsultationEditorState, {
	PriceStatus,
	type ConsultationEditorInit,
	type reducer,
	type State,
} from './useConsultationEditorState';

const Main = styled(Grid)(({theme}) => ({
	marginTop: 64,
	paddingTop: theme.spacing(3),
}));

type LoaderProps =
	| {loading: true; found: unknown; consultation: unknown}
	| {loading: false; found: false; consultation: unknown}
	| {loading: false; found: true; consultation: ConsultationEditorInit};

const Loader = ({loading, found, consultation}: LoaderProps) => {
	if (loading) return <Loading />;

	if (!found) {
		return <NoContent>Consultation not found.</NoContent>;
	}

	if (!consultation.isDone) return <Loading />;

	return <ConsultationEditor consultation={consultation} />;
};

const useInBookNumberEffect = (
	{
		_id: consultationId,
		book: initBook,
		inBookNumber: initInBookNumber,
	}: ConsultationEditorInit,
	{fields: {book}, config: {syncInBookNumber}}: State,
	dispatch: Dispatch<ReducerAction<typeof reducer>>,
) => {
	const {loading, inBookNumber} = useNextInBookNumber(book);

	useEffect(() => {
		if (book === initBook && consultationId !== undefined) {
			const value = String(initInBookNumber ?? '');
			dispatch({type: 'update', key: 'inBookNumberString', value});
		} else if (books.isRealBookNumberStringRegex.test(book)) {
			dispatch({type: 'loading-next-in-book-number'});
		} else {
			dispatch({type: 'disable-in-book-number'});
		}
	}, [consultationId, book, initBook, initInBookNumber]);

	useEffect(() => {
		if (!loading && syncInBookNumber) {
			dispatch({type: 'sync-in-book-number', inBookNumber});
		}
	}, [loading, syncInBookNumber, inBookNumber]);
};

type ConsultationEditorProps = {
	readonly consultation: ConsultationEditorInit;
};

const ConsultationEditor = ({consultation}: ConsultationEditorProps) => {
	const navigate = useNavigate();
	const dialog = useDialog();

	const [compare, setCompare] = useState(false);

	const {_id: consultationId, patientId} = consultation;

	const [state, dispatch] = useConsultationEditorState(consultation);

	const {
		fields: {
			datetime,
			reason,
			done,
			todo,
			treatment,
			next,
			more,

			currency,
			payment_method,
			priceString,
			paidString,
			book,

			inBookNumberString,
		},
		config: {dirty, saving, lastSaveWasSuccessful, lastInsertedId, priceStatus},
	} = state;

	usePrompt(
		'You are trying to leave the page without saving your changes. Are you sure you want to continue?',
		dirty,
	);

	useEffect(() => {
		if (lastSaveWasSuccessful && lastInsertedId) {
			navigate(`/edit/consultation/${lastInsertedId}`);
		}
	}, [navigate, lastSaveWasSuccessful, lastInsertedId]);

	useInBookNumberEffect(consultation, state, dispatch);

	const showSuccess = !dirty && lastSaveWasSuccessful;

	const update =
		(key, transform = (x) => x) =>
		(e) => {
			dispatch({type: 'update', key, value: transform(e.target.value)});
		};

	const handleSave = async (event) => {
		event.preventDefault();

		const updatedConsultationDocument = removeUndefined({
			patientId,
			datetime,
			reason,
			done,
			todo,
			treatment,
			next,
			more,

			currency,
			payment_method,
			price: parseNonNegativeIntegerStrictOrUndefined(priceString),
			paid: parseNonNegativeIntegerStrictOrUndefined(paidString),
			book,
			inBookNumber:
				parseNonNegativeIntegerStrictOrUndefined(inBookNumberString),
		});

		if (
			priceStatus !== PriceStatus.OK &&
			!(await dialog((resolve) => (
				<ConfirmationDialog
					title="Confirm"
					text={
						priceStatus === PriceStatus.SHOULD_NOT_BE_EMPTY
							? "This consultation's price is not set."
							: `This consultation has a price of ${priceString}.`
					}
					cancel="Cancel"
					confirm={
						consultationId === undefined
							? 'Create consultation anyway'
							: 'Update consultation anyway'
					}
					onCancel={() => {
						resolve(false);
					}}
					onConfirm={() => {
						resolve(true);
					}}
				/>
			)))
		)
			return;

		dispatch({type: 'save'});

		try {
			if (consultationId === undefined) {
				const {insertedId} = await call(
					insertConsultation,
					updatedConsultationDocument,
				);
				dispatch({type: 'save-success', insertedId});
			} else {
				const consultationUpdate = documentDiff(
					consultation,
					updatedConsultationDocument,
				);
				await call(updateConsultation, consultationId, consultationUpdate);
				dispatch({type: 'save-success'});
			}
		} catch (error: unknown) {
			console.error(error);
			dispatch({type: 'save-failure'});
		}
	};

	return (
		<div>
			<ConsultationEditorHeader
				consultation={consultation}
				state={state}
				update={update}
			/>
			<Main container spacing={3}>
				{compare && (
					<Grid item xs={12} lg={6} xl={4}>
						<PrecedingConsultationsList consultation={consultation} />
					</Grid>
				)}
				<Grid item xs={12} lg={compare ? 6 : 12} xl={compare ? 8 : 12}>
					<ConsultationForm state={state} update={update} />
				</Grid>
			</Main>
			<FixedFab
				col={2}
				color={compare ? 'primary' : 'default'}
				aria-label="compare"
				onClick={() => {
					setCompare(!compare);
				}}
			>
				<VerticalSplitIcon />
			</FixedFab>
			<FixedFab
				col={1}
				color="primary"
				aria-label={showSuccess ? 'saved' : 'save'}
				disabled={!dirty}
				pending={saving}
				onClick={handleSave}
			>
				{showSuccess ? <CheckIcon /> : <SaveIcon />}
			</FixedFab>
		</div>
	);
};

export default Loader;
