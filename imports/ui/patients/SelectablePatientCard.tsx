import React from 'react';

import {styled} from '@mui/material/styles';

import ButtonBase from '@mui/material/ButtonBase';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';

import GenericStaticPatientCard from './GenericStaticPatientCard';

const PREFIX = 'SelectablePatientCard';

const classes = {
	root: `${PREFIX}-root`,
	veil: `${PREFIX}-veil`,
	veilSelected: `${PREFIX}-veilSelected`,
	veilNotSelected: `${PREFIX}-veilNotSelected`,
	checkbox: `${PREFIX}-checkbox`,
};

type Props = {
	patient: {_id: string};
	onClick: (patient: {_id: string}) => void;
	selected?: boolean | undefined;
	Card?: React.ElementType;
};

const SelectablePatientCard = styled(
	({
		onClick,
		selected = undefined,
		Card = GenericStaticPatientCard,
		patient,
		...rest
	}: Props) => {
		return (
			<div className={classes.root}>
				<Card patient={patient} {...rest} />
				{selected !== undefined && selected && (
					<CheckCircleOutlinedIcon
						className={classes.checkbox}
						color="primary"
						fontSize="large"
					/>
				)}
				{selected !== undefined && !selected && (
					<RadioButtonUncheckedOutlinedIcon
						className={classes.checkbox}
						color="action"
						fontSize="large"
					/>
				)}
				<ButtonBase
					focusRipple
					className={classes.veil}
					onClick={() => {
						onClick(patient);
					}}
				/>
			</div>
		);
	},
)(({theme, selected}) => ({
	[`& .${classes.root}`]: {
		position: 'relative',
	},

	[`& .${classes.veil}`]: {
		width: '100%',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		fontSize: '2rem',
		cursor: 'pointer',
		color: theme.palette.primary.main,
		backgroundColor:
			selected === undefined
				? 'transparent'
				: selected
				? 'rgba(128,128,255,0.25)'
				: 'rgba(255,255,255,0.5)',
		transition: 'background-color 500ms ease-out',
	},

	[`& .${classes.checkbox}`]: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
}));

// @ts-expect-error TODO Find a different solution to deduplicate queries. GraphQL?
SelectablePatientCard.projection = GenericStaticPatientCard.projection;

export default SelectablePatientCard;
