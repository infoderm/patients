import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

import {Link} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import {dataURL as pngDataURL} from '../../util/png';

const useStyles = makeStyles((theme) => ({
	chip: {
		marginRight: theme.spacing(1),
		fontWeight: 'bold',
		maxWidth: '200px'
	},
	loading: {
		backgroundColor: '#aaa',
		color: '#fff'
	},
	found: {
		backgroundColor: '#88f',
		color: '#fff'
	},
	notfound: {
		backgroundColor: '#f88',
		color: '#fff'
	},
	willBeCreated: {
		backgroundColor: '#8f8',
		color: '#222'
	}
}));

export default function StaticPatientChip({
	className,
	loading,
	found,
	patient,
	onClick,
	onDelete
}) {
	const classes = useStyles();

	let component;
	let to;
	if (!onClick && !onDelete) {
		component = Link;
		to = `/patient/${patient._id}`;
	}

	const willBeCreated = patient._id === '?';

	return (
		<Chip
			key={patient._id}
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
								.filter((x) => Boolean(x))
								.join(' ')
						: `Not found`
					: `${patient.lastname} ${patient.firstname}`
			}
			className={classNames(
				classes.chip,
				loading
					? classes.loading
					: found
					? classes.found
					: willBeCreated
					? classes.willBeCreated
					: classes.notfound,
				className
			)}
			component={component}
			to={to}
			onClick={onClick}
			onDelete={onDelete}
		/>
	);
}

StaticPatientChip.projection = {
	firstname: 1,
	lastname: 1,
	photo: 1
};

StaticPatientChip.defaultProps = {
	loading: false,
	found: true
};

StaticPatientChip.propTypes = {
	className: PropTypes.string,
	loading: PropTypes.bool,
	found: PropTypes.bool,
	patient: PropTypes.object.isRequired,
	onClick: PropTypes.func,
	onDelete: PropTypes.func
};
