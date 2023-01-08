import React from 'react';

import {Link} from 'react-router-dom';

import {styled} from '@mui/material/styles';
import MuiChip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';

import {dataURL as pngDataURL} from '../../util/png';

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
})<MuiChipProps>(({theme, loading, found, willBeCreated}) => ({
	marginRight: theme.spacing(1),
	fontWeight: 'bold',
	maxWidth: '200px',
	...(willBeCreated
		? {
				backgroundColor: '#8f8',
				color: '#222',
		  }
		: loading
		? {
				backgroundColor: '#aaa',
				color: '#fff',
		  }
		: found
		? {
				backgroundColor: '#88f',
				color: '#fff',
		  }
		: {
				backgroundColor: '#f88',
				color: '#fff',
		  }),
}));

type Props = {
	className?: string;
	style?: React.CSSProperties;
	loading?: boolean;
	found?: boolean;
	patient: {
		_id: string;
		firstname?: string;
		lastname?: string;
		photo?: string;
	};
	onClick?: () => void;
	onDelete?: () => void;
};

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
		let component: React.ElementType;
		let to: string;
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
				avatar={
					!loading && found && patient.photo ? (
						<Avatar src={pngDataURL(patient.photo)} />
					) : null
				}
				label={
					loading
						? patient._id
						: !found
						? willBeCreated
							? [patient.lastname, patient.firstname, '(new)']
									.filter(Boolean)
									.join(' ')
							: `Not found`
						: `${patient.lastname} ${patient.firstname}`
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
};
