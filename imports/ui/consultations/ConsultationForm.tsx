import React, {useState} from 'react';
import {styled} from '@mui/material/styles';

import getYear from 'date-fns/getYear';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import WarningIcon from '@mui/icons-material/Warning';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import BlockIcon from '@mui/icons-material/Block';
import Typography from '@mui/material/Typography';

import CircularProgress from '@mui/material/CircularProgress';

import TextField from '../input/TextField';

import useBookStats from '../books/useBookStats';
import {books} from '../../api/books';
import AutocompleteWithSuggestions from '../input/AutocompleteWithSuggestions';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions';
import CurrencyAmountInput from '../input/CurrencyAmountInput';
import {parsePositiveIntegerStrictOrUndefined} from '../../api/string';
import useBooksFind from '../books/useBooksFind';

import {type State} from './useConsultationEditorState';

const useInBookNumberCollides = (
	consultationId: string | undefined,
	bookName: string,
	inBookNumberString: string,
) => {
	const inBookNumber =
		parsePositiveIntegerStrictOrUndefined(inBookNumberString);

	const {loading, result} = useBookStats(
		inBookNumber === undefined ? undefined : bookName,
		{
			_id: consultationId && {$ne: consultationId},
			inBookNumber,
		},
	);

	return !loading && result !== undefined && result.count >= 1;
};

const StyledPaper = styled(Paper)(({theme}) => ({
	padding: theme.spacing(3),
}));

const TextArea = styled(TextField)(() => ({
	overflow: 'auto',
	width: '100%',
}));

type Props = {
	readonly state: State;
	readonly update?: (
		key: string,
		transform?: (x: any) => any,
	) => (event: {target: {value: any}}) => void;
};

const ConsultationForm = ({
	state: {fields: consultation, config},
	update,
}: Props) => {
	const {
		_id,
		datetime,

		reason,
		done,
		todo,
		treatment,
		next,
		more,

		currency,
		payment_method,
		inBookNumberString,
		priceString,
		paidString,
		book,
	} = consultation;

	const {
		syncInBookNumber,
		loadingInBookNumber,
		syncPaid,
		inBookNumberError,
		inBookNumberDisabled,
		priceWarning,
		priceError,
		paidError,
	} = config;

	// eslint-disable-next-line react/hook-use-state
	const [initialDatetime] = useState(datetime);
	// eslint-disable-next-line react/hook-use-state
	const [initialBook] = useState(book);
	const initialBookName = books.name(initialDatetime, initialBook);

	const bookName = books.name(datetime, book);
	const {loading: loadingBookStats, result: bookStats} = useBookStats(bookName);

	const bookIsFull =
		!loadingBookStats &&
		bookStats !== undefined &&
		bookStats.count >=
			books.MAX_CONSULTATIONS + (_id && initialBookName === bookName ? 1 : 0) &&
		books.isReal(bookName);

	const inBookNumberCollides = useInBookNumberCollides(
		_id,
		bookName,
		inBookNumberString,
	);

	const consultationYear = getYear(datetime);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<StyledPaper>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextArea
								multiline
								readOnly={!update}
								autoFocus={Boolean(update)}
								label="Motif de la visite"
								placeholder="Motif de la visite"
								minRows={5}
								value={reason}
								margin="normal"
								onChange={update?.('reason')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextArea
								multiline
								readOnly={!update}
								label="Examens déjà réalisés"
								placeholder="Examens déjà réalisés"
								minRows={2}
								value={done}
								margin="normal"
								onChange={update?.('done')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextArea
								multiline
								readOnly={!update}
								label="Examens à réaliser"
								placeholder="Examens à réaliser"
								minRows={2}
								value={todo}
								margin="normal"
								onChange={update?.('todo')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextArea
								multiline
								readOnly={!update}
								label="Traitement"
								placeholder="Traitement"
								minRows={5}
								value={treatment}
								margin="normal"
								onChange={update?.('treatment')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextArea
								multiline
								readOnly={!update}
								label="À revoir"
								placeholder="À revoir"
								minRows={2}
								value={next}
								margin="normal"
								onChange={update?.('next')}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextArea
								multiline
								readOnly={!update}
								label="Autres remarques"
								placeholder="Write some additional information about the consultation here"
								minRows={2}
								value={more}
								margin="normal"
								onChange={update?.('more')}
							/>
						</Grid>
					</Grid>
				</StyledPaper>
			</Grid>
			<Grid item xs={12}>
				<StyledPaper>
					<Typography variant="h6">Payment</Typography>
					<Grid container spacing={3}>
						<Grid item xs={3}>
							<TextField
								fullWidth
								select
								readOnly={!update}
								label="Currency"
								value={currency}
								margin="normal"
								onChange={update?.('currency')}
							>
								<MenuItem value="EUR">€</MenuItem>
							</TextField>
						</Grid>
						<Grid item xs={3}>
							<TextField
								fullWidth
								select
								readOnly={!update}
								label="Payment Method"
								value={payment_method}
								margin="normal"
								onChange={update?.('payment_method')}
							>
								<MenuItem value="cash">cash</MenuItem>
								<MenuItem value="wire">virement</MenuItem>
								<MenuItem value="third-party">tiers payant</MenuItem>
							</TextField>
						</Grid>
						<Grid item xs={3}>
							<TextField
								fullWidth
								readOnly={!update}
								label="Prix"
								value={priceString}
								margin="normal"
								error={priceError}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												size="large"
												sx={priceWarning ? undefined : {display: 'none'}}
											>
												<WarningIcon />
											</IconButton>
										</InputAdornment>
									),
									inputComponent: CurrencyAmountInput as any,
									inputProps: {currency},
								}}
								onChange={update?.('priceString')}
							/>
						</Grid>
						<Grid item xs={3}>
							<TextField
								fullWidth
								readOnly={!update}
								label="Payé"
								value={paidString}
								margin="normal"
								error={paidError}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton size="large">
												{syncPaid ? <LinkIcon /> : <LinkOffIcon />}
											</IconButton>
										</InputAdornment>
									),
									inputComponent: CurrencyAmountInput as any,
									inputProps: {currency},
								}}
								onChange={update?.('paidString')}
							/>
						</Grid>
					</Grid>
				</StyledPaper>
			</Grid>
			<Grid item xs={12}>
				<StyledPaper>
					<Typography variant="h6">Accounting</Typography>
					<Grid container spacing={3}>
						<Grid item xs={6}>
							{update ? (
								<AutocompleteWithSuggestions
									itemToString={(x) => (x ? x.bookNumber : '')}
									useSuggestions={makeSubstringSuggestions(
										useBooksFind,
										[],
										'bookNumber',
										{fiscalYear: consultationYear},
									)}
									TextFieldProps={{
										label: 'Carnet',
										margin: 'normal',
										error: bookIsFull,
										helperText: bookIsFull && 'Check if book is full!',
									}}
									InputProps={{
										endAdornment: bookIsFull && <WarningIcon />,
									}}
									inputValue={book}
									onInputChange={(event, newInputValue) => {
										if (event) {
											update(
												'book',
												books.sanitizeInput,
											)({target: {value: newInputValue}});
										}
									}}
								/>
							) : (
								<TextField
									readOnly
									label="Carnet"
									value={book}
									margin="normal"
								/>
							)}
						</Grid>
						<Grid item xs={6}>
							<TextField
								fullWidth
								disabled={inBookNumberDisabled}
								readOnly={!update}
								label="N°"
								value={inBookNumberString}
								margin="normal"
								error={
									!inBookNumberDisabled &&
									(inBookNumberError || inBookNumberCollides)
								}
								helperText={inBookNumberCollides && 'Collision'}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton size="large">
												{loadingInBookNumber ? (
													<CircularProgress color="inherit" size={20} />
												) : inBookNumberDisabled ? (
													<BlockIcon />
												) : syncInBookNumber ? (
													<LinkIcon />
												) : (
													<LinkOffIcon />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
								onChange={update?.('inBookNumberString')}
							/>
						</Grid>
					</Grid>
				</StyledPaper>
			</Grid>
		</Grid>
	);
};

export default ConsultationForm;
