import React from 'react';

import {Link} from 'react-router-dom';

import {styled} from '@mui/material/styles';
import MuiChip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import pngDataURL from '../../util/png/dataURL';

type MuiChipProps = {
	loading: boolean | undefined;
	found: boolean | undefined;
	willBeCreated: boolean;
	component: React.ElementType | undefined;
	to: string | undefined;
};

const additionalProps = new Set<string | number | Symbol>([
	'loading',
	'found',
	'willBeCreated',
]);

const Chip = styled(MuiChip, {
	shouldForwardProp: (prop) => !additionalProps.has(prop),
})<MuiChipProps>(({theme}) => ({
	marginRight: theme.spacing(1),
	fontWeight: 'bold',
	maxWidth: '200px',
	overflow: 'hidden',
	textOverflow: 'ellipisis',
}));

type Patient = {
	_id: string;
	firstname?: string;
	lastname?: string;
	photo?: string;
};

type Props = {
	readonly className?: string;
	readonly style?: React.CSSProperties;
	readonly loading?: boolean;
	readonly found?: boolean;
	readonly patient: Patient;
	readonly onClick?: () => void;
	readonly onDelete?: () => void;
};

const displayName = ({firstname, lastname}: Patient) =>
	[lastname, firstname].filter(Boolean).join(' ') || 'Unknown';

const StaticPatientChip = React.forwardRef(
	(
		{
			className,
			style,
			loading = false,
			found = true,
			patient,
			onClick = undefined,
			onDelete = undefined,
		}: Props,
		ref: any,
	) => {
		let component: React.ElementType | undefined;
		let to: string | undefined;
		if (!onClick && !onDelete) {
			component = Link;
			to = `/patient/${patient._id}`;
		}

		const willBeCreated = patient._id === '?';

		return (
			<Chip
				ref={ref}
				key={patient._id}
				className={className}
				style={style}
				color={
					willBeCreated ? 'green' : loading ? undefined : found ? 'blue' : 'red'
				}
				avatar={
					!loading && found && patient.photo ? (
						<Avatar src={pngDataURL(patient.photo)} />
					) : undefined
				}
				label={
					loading
						? patient._id
						: !found
						? willBeCreated
							? `${displayName(patient)} (new)`
							: `Not found`
						: displayName(patient)
				}
				loading={loading}
				found={found}
				willBeCreated={willBeCreated}
				component={component}
				to={to}
				onClick={onClick}
				onDelete={onDelete}
			/>
		);
	},
);

export default StaticPatientChip;

export const projection = {
	firstname: 1,
	lastname: 1,
	photo: 1,
} as const;
