import React from 'react';

import {styled} from '@mui/material/styles';

import ButtonBase from '@mui/material/ButtonBase';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';

import type PropsOf from '../../lib/types/PropsOf';
import GenericStaticPatientCard from './GenericStaticPatientCard';

type Props = {
	patient: {_id: string};
	onClick: (patient: {_id: string}) => void;
	selected?: boolean | undefined;
	Card?: React.ElementType;
};

const ClickableArea = styled(ButtonBase, {
	shouldForwardProp: (prop) => prop !== 'selected',
})<PropsOf<typeof ButtonBase> & Pick<Props, 'selected'>>(
	({theme, selected}) => ({
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
	}),
);

const selectionStateIconStyles = ({theme}) =>
	({
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	} as const);

const SelectedIcon = styled(CheckCircleOutlinedIcon)(selectionStateIconStyles);
const UnselectedIcon = styled(RadioButtonUncheckedOutlinedIcon)(
	selectionStateIconStyles,
);

const SelectionStateIcon = ({selected}: Pick<Props, 'selected'>) => {
	if (selected === undefined) {
		return null;
	}

	const Icon = selected ? SelectedIcon : UnselectedIcon;

	const color = selected ? 'primary' : 'action';

	return <Icon color={color} fontSize="large" />;
};

const Root = styled('div')({
	position: 'relative',
});

const SelectablePatientCard = ({
	onClick,
	selected = undefined,
	Card = GenericStaticPatientCard,
	patient,
	...rest
}: Props) => {
	return (
		<Root>
			<Card patient={patient} {...rest} />
			<SelectionStateIcon selected={selected} />
			<ClickableArea
				focusRipple
				selected={selected}
				onClick={() => {
					onClick(patient);
				}}
			/>
		</Root>
	);
};

SelectablePatientCard.projection = GenericStaticPatientCard.projection;

export default SelectablePatientCard;
