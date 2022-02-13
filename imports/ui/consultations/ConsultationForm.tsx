import React, {useState} from 'react';
import {styled} from '@mui/material/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import WarningIcon from '@mui/icons-material/Warning';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';

import TextField from '../input/TextField';

import useBookStats from '../books/useBookStats';
import {books, useBooksFind} from '../../api/books';
import AutocompleteWithSuggestions from '../input/AutocompleteWithSuggestions';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions';
import CurrencyAmountInput from '../input/CurrencyAmountInput';

const PREFIX = 'ConsultationForm';

const classes = {
	multiline: `${PREFIX}-multiline`,
	form: `${PREFIX}-form`,
	hidden: `${PREFIX}-hidden`,
};

const StyledPaper = styled(Paper)(({theme}) => ({
	[`& .${classes.multiline}`]: {
		margin: theme.spacing(1),
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing(2)})`,
	},

	[`&.${classes.form}`]: {
		padding: theme.spacing(3),
	},

	[`& .${classes.hidden}`]: {
		display: 'none',
	},
}));

const ConsultationForm = ({consultation, update}) => {
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
		priceString,
		paidString,
		book,

		syncPaid,
		priceWarning,
		priceError,
		paidError,
	} = consultation;

	const [initialDatetime] = useState(datetime);
	const [initialBook] = useState(book);
	const initialBookName = books.name(initialDatetime, initialBook);

	const bookName = books.name(datetime, book);
	const {loading, result} = useBookStats(bookName);

	const bookIsFull =
		!loading &&
		result?.count >=
			books.MAX_CONSULTATIONS + (_id && initialBookName === bookName ? 1 : 0) &&
		books.isReal(bookName);

	return (
		<StyledPaper className={classes.form}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<TextField
						multiline
						readOnly={!update}
						autoFocus={Boolean(update)}
						label="Motif de la visite"
						placeholder="Motif de la visite"
						rows={4}
						className={classes.multiline}
						value={reason}
						margin="normal"
						onChange={update?.('reason')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						readOnly={!update}
						label="Examens déjà réalisés"
						placeholder="Examens déjà réalisés"
						rows={4}
						className={classes.multiline}
						value={done}
						margin="normal"
						onChange={update?.('done')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						readOnly={!update}
						label="Examens à réaliser"
						placeholder="Examens à réaliser"
						rows={4}
						className={classes.multiline}
						value={todo}
						margin="normal"
						onChange={update?.('todo')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						readOnly={!update}
						label="Traitement"
						placeholder="Traitement"
						rows={4}
						className={classes.multiline}
						value={treatment}
						margin="normal"
						onChange={update?.('treatment')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						readOnly={!update}
						label="À revoir"
						placeholder="À revoir"
						rows={4}
						className={classes.multiline}
						value={next}
						margin="normal"
						onChange={update?.('next')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						readOnly={!update}
						label="Autres remarques"
						placeholder="Write some additional information about the consultation here"
						rows={4}
						className={classes.multiline}
						value={more}
						margin="normal"
						onChange={update?.('more')}
					/>
				</Grid>

				<Grid item xs={1}>
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
				<Grid item xs={2}>
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
										className={classNames({
											[classes.hidden]: !priceWarning,
										})}
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
				<Grid item xs={3}>
					{update ? (
						<AutocompleteWithSuggestions
							itemToString={(x) => (x ? x.bookNumber : '')}
							useSuggestions={makeSubstringSuggestions(
								useBooksFind,
								[],
								'bookNumber',
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
									return update(
										'book',
										books.sanitizeInput,
									)({target: {value: newInputValue}});
								}
							}}
						/>
					) : (
						<TextField readOnly label="Carnet" value={book} margin="normal" />
					)}
				</Grid>
			</Grid>
		</StyledPaper>
	);
};

ConsultationForm.propTypes = {
	consultation: PropTypes.object.isRequired,
	update: PropTypes.func,
};

export default ConsultationForm;
