import React from 'react' ;
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { Link } from 'react-router-dom'

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(
	theme => ({
		chip: {
			marginRight: theme.spacing(1),
			backgroundColor: '#aaa',
			color: '#fff',
		},
	})
);

export default function PatientChip ( { className , loading , exists , patient } ) {

	const classes = useStyles();

	return (
		<Chip
			key={patient._id}
			avatar={(!loading && patient && patient.photo) ? <Avatar src={`data:image/png;base64,${patient.photo}`}/> : null}
			label={loading ? patient._id : !exists ? 'Not found' : `${patient.lastname} ${patient.firstname}`}
			className={classNames(classes.chip, className)}
			component={Link}
			to={`/patient/${patient._id}`}
		/>
	) ;
}

PatientChip.projection = {
	firstname: 1,
	lastname: 1,
	photo: 1,
} ;

PatientChip.defaultProps = {
	loading: false,
	exists: true,
} ;

PatientChip.propTypes = {
	className: PropTypes.string,
	loading: PropTypes.bool.isRequired,
	exists: PropTypes.bool.isRequired,
	patient: PropTypes.object.isRequired,
} ;
