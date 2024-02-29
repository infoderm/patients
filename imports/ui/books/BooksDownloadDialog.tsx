import assert from 'assert';

import React, {useState, useEffect} from 'react';

import addYears from 'date-fns/addYears';

import {useSnackbar} from 'notistack';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {DatePicker} from '@mui/x-date-pickers';

import SaveIcon from '@mui/icons-material/Save';
import TuneIcon from '@mui/icons-material/Tune';

import LoadingButton from '@mui/lab/LoadingButton';

import CancelButton from '../button/CancelButton';

import GridContainerInsideDialogContent from '../grid/GridContainerInsideDialogContent';

import saveTextAs from '../output/saveTextAs';

import {books} from '../../api/books';
import withLazyOpening from '../modal/withLazyOpening';
import csv from '../../api/endpoint/books/csv';
import debounceSnackbar from '../snackbar/debounceSnackbar';
import useCall from '../action/useCall';

type Props = {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly initialBegin: Date;
	readonly initialEnd?: Date;
	readonly initialAdvancedFunctionality?: boolean;
};

const BooksDownloadDialog = ({
	open,
	onClose,
	initialBegin,
	initialEnd,
	initialAdvancedFunctionality = false,
}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [call, {pending}] = useCall();

	const [advancedFunctionality, setAdvancedFunctionality] = useState(
		initialAdvancedFunctionality,
	);
	const [begin, setBegin] = useState<Date | null>(initialBegin);
	const [end, setEnd] = useState<Date | null>(
		initialEnd ?? addYears(initialBegin, 1),
	);
	const [firstBook, setFirstBook] = useState(String(books.DOWNLOAD_FIRST_BOOK));
	const [lastBook, setLastBook] = useState(String(books.DOWNLOAD_LAST_BOOK));
	const [maxRows, setMaxRows] = useState(String(books.DOWNLOAD_MAX_ROWS));

	const setYear = (year: number | undefined) => {
		if (year === undefined) {
			setBegin(null);
			setEnd(null);
		} else {
			const newBegin = new Date(year, 0, 1);
			const newEnd = addYears(newBegin, 1);
			setBegin(newBegin);
			setEnd(newEnd);
		}
	};

	useEffect(() => {
		setAdvancedFunctionality(initialAdvancedFunctionality);
		setBegin(initialBegin);
		setEnd(initialEnd ?? addYears(initialBegin, 1));
		setFirstBook(String(books.DOWNLOAD_FIRST_BOOK));
		setLastBook(String(books.DOWNLOAD_LAST_BOOK));
		setMaxRows(String(books.DOWNLOAD_MAX_ROWS));
	}, [initialAdvancedFunctionality, Number(initialBegin), Number(initialEnd)]);

	const downloadData = async (event) => {
		assert(begin !== null);
		assert(end !== null);
		event.preventDefault();
		const _firstBook = Number.parseInt(firstBook, 10);
		const _lastBook = Number.parseInt(lastBook, 10);
		const _maxRows = Number.parseInt(maxRows, 10);
		const feedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
		feedback('Creating report...', {
			variant: 'info',
			persist: true,
		});
		try {
			const res = await call(csv, begin, end, _firstBook, _lastBook, _maxRows);
			feedback('Report ready!', {variant: 'success'});
			const filename = advancedFunctionality
				? 'carnets.csv'
				: `carnets-${begin.getFullYear()}.csv`;
			saveTextAs(res, filename);
			onClose();
		} catch (error: unknown) {
			console.error(error);
			const message = error instanceof Error ? error.message : 'unknown error';
			feedback(message, {variant: 'error'});
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Download book data as CSV</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{advancedFunctionality ? 'Tune parameters' : 'Choose year'} then click
					download.
				</DialogContentText>
				<GridContainerInsideDialogContent spacing={3}>
					{advancedFunctionality ? (
						<>
							<Grid item xs={6}>
								<DatePicker
									slotProps={{
										textField: {fullWidth: true},
									}}
									label="Begin"
									value={begin}
									onChange={(date) => {
										setBegin(date);
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<DatePicker
									slotProps={{
										textField: {fullWidth: true},
									}}
									label="End"
									value={end}
									onChange={(date) => {
										setEnd(date);
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="First book"
									value={firstBook}
									error={!/^\d+$/.test(firstBook)}
									onChange={(e) => {
										setFirstBook(e.target.value);
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="Last book"
									value={lastBook}
									error={!/^\d+$/.test(lastBook)}
									onChange={(e) => {
										setLastBook(e.target.value);
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="Max rows"
									value={maxRows}
									error={!/^\d+$/.test(maxRows)}
									onChange={(e) => {
										setMaxRows(e.target.value);
									}}
								/>
							</Grid>
						</>
					) : (
						<Grid item xs={12}>
							<DatePicker
								slotProps={{
									textField: {fullWidth: true},
								}}
								views={['year']}
								label="Year"
								value={begin}
								onChange={(date) => {
									setYear(date === null ? undefined : date.getFullYear());
								}}
							/>
						</Grid>
					)}
				</GridContainerInsideDialogContent>
			</DialogContent>
			<DialogActions>
				<CancelButton disabled={pending} onClick={onClose} />
				<Button
					disabled={advancedFunctionality || pending}
					endIcon={<TuneIcon />}
					onClick={() => {
						setAdvancedFunctionality(true);
					}}
				>
					Advanced
				</Button>
				<LoadingButton
					loading={pending}
					disabled={begin === null}
					color="primary"
					endIcon={<SaveIcon />}
					loadingPosition="end"
					onClick={downloadData}
				>
					Download
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(BooksDownloadDialog);
