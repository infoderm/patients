import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import WarningIcon from '@material-ui/icons/Warning';

import TextField from '../input/TextField';

import useBookStats from '../books/useBookStats';
import {books, useBooksFind} from '../../api/books';
import AutocompleteWithSuggestions from '../input/AutocompleteWithSuggestions';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions';
import CurrencyAmountInput from '../input/CurrencyAmountInput';

const styles = (theme) => ({
	multiline: {
		margin: theme.spacing(1),
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing(2)}px)`
	},
	form: {
		padding: theme.spacing(3)
	},
	hidden: {
		display: 'none'
	}
});

const useStyles = makeStyles(styles);

const ConsultationForm = ({consultation, update}) => {
	const classes = useStyles();

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
		price,
		paid,
		book,

		priceWarning,
		priceError,
		paidError
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
		<Paper className={classes.form}>
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
						onChange={update && update('reason')}
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
						onChange={update && update('done')}
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
						onChange={update && update('todo')}
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
						onChange={update && update('treatment')}
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
						onChange={update && update('next')}
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
						onChange={update && update('more')}
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
						onChange={update && update('currency')}
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
						onChange={update && update('payment_method')}
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
						value={price}
						margin="normal"
						error={priceError}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										className={classNames({
											[classes.hidden]: !priceWarning
										})}
									>
										<WarningIcon />
									</IconButton>
								</InputAdornment>
							),
							inputComponent: CurrencyAmountInput,
							inputProps: {currency}
						}}
						onChange={update && update('price')}
					/>
				</Grid>
				<Grid item xs={3}>
					<TextField
						fullWidth
						readOnly={!update}
						label="Payé"
						value={paid}
						margin="normal"
						error={paidError}
						InputProps={{
							inputComponent: CurrencyAmountInput,
							inputProps: {currency}
						}}
						onChange={update && update('paid')}
					/>
				</Grid>
				<Grid item xs={3}>
					{update ? (
						<AutocompleteWithSuggestions
							itemToString={(x) => (x ? x.bookNumber : '')}
							useSuggestions={makeSubstringSuggestions(
								useBooksFind,
								[],
								'bookNumber'
							)}
							TextFieldProps={{
								label: 'Carnet',
								margin: 'normal',
								error: bookIsFull,
								helperText: bookIsFull && 'Check if book is full!'
							}}
							InputProps={{
								endAdornment: bookIsFull && <WarningIcon />
							}}
							inputValue={book}
							onInputChange={(event, newInputValue) => {
								if (event) {
									return update(
										'book',
										books.sanitizeInput
									)({target: {value: newInputValue}});
								}
							}}
						/>
					) : (
						<TextField readOnly label="Carnet" value={book} margin="normal" />
					)}
				</Grid>
			</Grid>
		</Paper>
	);
};

ConsultationForm.propTypes = {
	consultation: PropTypes.object.isRequired,
	update: PropTypes.func
};

export default ConsultationForm;
