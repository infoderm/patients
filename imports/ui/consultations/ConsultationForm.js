import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {makeStyles} from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import WarningIcon from '@material-ui/icons/Warning';

import {books, useBooksFind} from '../../api/books.js';
import AutocompleteWithSuggestions from '../input/AutocompleteWithSuggestions.js';
import makeSubstringSuggestions from '../input/makeSubstringSuggestions.js';

const styles = (theme) => ({
	multiline: {
		margin: theme.spacing(1),
		overflow: 'auto',
		width: `calc(100% - ${theme.spacing(2)}px)`
	},
	form: {
		marginTop: 64 + theme.spacing(3),
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

		priceWarning
	} = consultation;

	return (
		<Paper className={classes.form}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<TextField
						autoFocus
						multiline
						label="Motif de la visite"
						placeholder="Motif de la visite"
						rows={4}
						className={classes.multiline}
						value={reason}
						margin="normal"
						onChange={update('reason')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						label="Examens déjà réalisés"
						placeholder="Examens déjà réalisés"
						rows={4}
						className={classes.multiline}
						value={done}
						margin="normal"
						onChange={update('done')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						label="Examens à réaliser"
						placeholder="Examens à réaliser"
						rows={4}
						className={classes.multiline}
						value={todo}
						margin="normal"
						onChange={update('todo')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						label="Traitement"
						placeholder="Traitement"
						rows={4}
						className={classes.multiline}
						value={treatment}
						margin="normal"
						onChange={update('treatment')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						label="À revoir"
						placeholder="À revoir"
						rows={4}
						className={classes.multiline}
						value={next}
						margin="normal"
						onChange={update('next')}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						multiline
						label="Autres remarques"
						placeholder="Write some additional information about the consultation here"
						rows={4}
						className={classes.multiline}
						value={more}
						margin="normal"
						onChange={update('more')}
					/>
				</Grid>

				<Grid item xs={1}>
					<TextField
						select
						label="Currency"
						value={currency}
						margin="normal"
						onChange={update('currency')}
					>
						<MenuItem value="EUR">€</MenuItem>
					</TextField>
				</Grid>
				<Grid item xs={1}>
					<TextField
						select
						label="Payment Method"
						value={payment_method}
						margin="normal"
						onChange={update('payment_method')}
					>
						<MenuItem value="cash">cash</MenuItem>
						<MenuItem value="wire">virement</MenuItem>
						<MenuItem value="third-party">tiers payant</MenuItem>
					</TextField>
				</Grid>
				<Grid item xs={3}>
					<TextField
						fullWidth
						label="Prix"
						value={price}
						margin="normal"
						error={!/^\d+$/.test(price)}
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
							)
						}}
						onChange={update('price')}
					/>
				</Grid>
				<Grid item xs={3}>
					<TextField
						label="Payé"
						value={paid}
						margin="normal"
						error={!/^\d+$/.test(paid)}
						onChange={update('paid')}
					/>
				</Grid>
				<Grid item xs={3}>
					<AutocompleteWithSuggestions
						itemToString={(x) => (x ? x.bookNumber : '')}
						useSuggestions={makeSubstringSuggestions(
							useBooksFind,
							[],
							'bookNumber'
						)}
						TextFieldProps={{
							label: 'Carnet',
							margin: 'normal'
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
				</Grid>
			</Grid>
		</Paper>
	);
};

ConsultationForm.propTypes = {
	consultation: PropTypes.object.isRequired
};

export default ConsultationForm;
