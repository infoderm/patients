import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

import ButtonBase from '@material-ui/core/ButtonBase';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';

import GenericStaticPatientCard from './GenericStaticPatientCard';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'relative',
	},
	veil: {
		width: '100%',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		fontSize: '2rem',
		cursor: 'pointer',
		color: theme.palette.primary.main,
		backgroundColor: 'transparent',
		transition: 'background-color 500ms ease-out',
	},
	veilSelected: {
		backgroundColor: 'rgba(128,128,255,0.25)',
	},
	veilNotSelected: {
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	checkbox: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
}));

const SelectablePatientCard = ({onClick, selected, Card, patient, ...rest}) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Card patient={patient} {...rest} />
			{selected === true && (
				<CheckCircleOutlinedIcon
					className={classes.checkbox}
					color="primary"
					fontSize="large"
				/>
			)}
			{selected === false && (
				<RadioButtonUncheckedOutlinedIcon
					className={classes.checkbox}
					color="action"
					fontSize="large"
				/>
			)}
			<ButtonBase
				focusRipple
				className={classNames(classes.veil, {
					[classes.veilSelected]: selected === true,
					[classes.veilNotSelected]: selected === false,
				})}
				onClick={() => onClick(patient)}
			/>
		</div>
	);
};

SelectablePatientCard.projection = GenericStaticPatientCard.projection;

SelectablePatientCard.defaultProps = {
	selected: undefined,
	Card: GenericStaticPatientCard,
};

SelectablePatientCard.propTypes = {
	selected: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	Card: PropTypes.elementType,
};

export default SelectablePatientCard;
