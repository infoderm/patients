import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

import {Link} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
	loading: {
		marginRight: theme.spacing(1),
		backgroundColor: '#aaa',
		fontWeight: 'bold',
		color: '#fff'
	},
	found: {
		marginRight: theme.spacing(1),
		backgroundColor: '#88f',
		fontWeight: 'bold',
		color: '#fff'
	},
	notfound: {
		marginRight: theme.spacing(1),
		backgroundColor: '#f88',
		fontWeight: 'bold',
		color: '#fff'
	}
}));

export default function StaticPatientChip({
	className,
	loading,
	found,
	patient
}) {
	const classes = useStyles();
	return (
		<Chip
			key={patient._id}
			avatar={
				!loading && found && patient.photo ? (
					<Avatar src={`data:image/png;base64,${patient.photo}`} />
				) : null
			}
			label={
				loading
					? patient._id
					: !found
					? `Not found`
					: `${patient.lastname} ${patient.firstname}`
			}
			className={classNames(
				loading ? classes.loading : found ? classes.found : classes.notfound,
				className
			)}
			component={Link}
			to={`/patient/${patient._id}`}
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
	patient: PropTypes.object.isRequired
};
