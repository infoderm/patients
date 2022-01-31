import React, {useState, useEffect} from 'react';

import addYears from 'date-fns/addYears';

import {useSnackbar} from 'notistack';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {MobileDatePicker as DatePicker} from '@material-ui/pickers';

import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import TuneIcon from '@material-ui/icons/Tune';

import GridContainerInsideDialogContent from '../grid/GridContainerInsideDialogContent';

import saveTextAs from '../output/saveTextAs';

import call from '../../api/endpoint/call';
import {books} from '../../api/books';
import withLazyOpening from '../modal/withLazyOpening';
import csv from '../../api/endpoint/books/csv';

interface Props {
	open: boolean;
	onClose: () => void;
	initialBegin: Date;
	initialEnd?: Date;
	initialAdvancedFunctionality?: boolean;
}

const BooksDownloadDialog = ({
	open,
	onClose,
	initialBegin,
	initialEnd,
	initialAdvancedFunctionality = false,
}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const [advancedFunctionality, setAdvancedFunctionality] = useState(
		initialAdvancedFunctionality,
	);
	const [begin, setBegin] = useState(initialBegin);
	const [end, setEnd] = useState(initialEnd ?? addYears(initialBegin, 1));
	const [firstBook, setFirstBook] = useState(String(books.DOWNLOAD_FIRST_BOOK));
	const [lastBook, setLastBook] = useState(String(books.DOWNLOAD_LAST_BOOK));
	const [maxRows, setMaxRows] = useState(String(books.DOWNLOAD_MAX_ROWS));

	const setYear = (year) => {
		const newBegin = new Date(year, 0, 1);
		const newEnd = addYears(newBegin, 1);
		setBegin(newBegin);
		setEnd(newEnd);
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
		event.preventDefault();
		const _firstBook = Number.parseInt(firstBook, 10);
		const _lastBook = Number.parseInt(lastBook, 10);
		const _maxRows = Number.parseInt(maxRows, 10);
		const key = enqueueSnackbar('Creating report...', {
			variant: 'info',
			persist: true,
		});
		try {
			const res = await call(csv, begin, end, _firstBook, _lastBook, _maxRows);
			closeSnackbar(key);
			enqueueSnackbar('Report ready!', {variant: 'success'});
			const filename = advancedFunctionality
				? 'carnets.csv'
				: `carnets-${begin.getFullYear()}.csv`;
			saveTextAs(res, filename);
			onClose();
		} catch (error: unknown) {
			console.error(error);
			closeSnackbar(key);
			const message = error instanceof Error ? error.message : 'unknown error';
			enqueueSnackbar(message, {variant: 'error'});
		}
	};

	return (
		<Dialog
			open={open}
			// component="form"
			aria-labelledby="books-download-dialog-title"
			onClose={onClose}
		>
			<DialogTitle id="books-download-dialog-title">
				Download book data as CSV
			</DialogTitle>
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
									renderInput={(props) => <TextField fullWidth {...props} />}
									label="Begin"
									value={begin}
									onChange={(date) => {
										setBegin(date);
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<DatePicker
									renderInput={(props) => <TextField fullWidth {...props} />}
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
								renderInput={(props) => <TextField fullWidth {...props} />}
								views={['year']}
								label="Year"
								value={begin}
								onChange={(date) => {
									setYear(date.getFullYear());
								}}
							/>
						</Grid>
					)}
				</GridContainerInsideDialogContent>
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
					disabled={advancedFunctionality}
					color="default"
					endIcon={<TuneIcon />}
					onClick={() => {
						setAdvancedFunctionality(true);
					}}
				>
					Advanced
				</Button>
				<Button color="primary" endIcon={<SaveIcon />} onClick={downloadData}>
					Download
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default withLazyOpening(BooksDownloadDialog);
