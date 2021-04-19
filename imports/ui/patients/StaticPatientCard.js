import React from 'react';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';
import {useTransition, animated} from 'react-spring';

import {makeStyles} from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

import eidFormatBirthdate from '../../api/eidFormatBirthdate.js';

const useStyles = makeStyles((theme) => ({
	card: {
		position: 'relative',
		transition: 'opacity 500ms ease-out',
		display: 'flex',
		minHeight: 200
	},
	veil: {
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 1,
		fontSize: '2rem'
	},
	details: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column'
	},
	header: {
		flex: '1 0 auto'
	},
	content: {
		flex: '1 0 auto'
	},
	photoPlaceHolder: {
		position: 'absolute',
		right: 0,
		top: 0,
		display: 'flex',
		fontSize: '4rem',
		margin: 0,
		width: 140,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff',
		backgroundColor: '#999'
	},
	photo: {
		position: 'absolute',
		right: 0,
		top: 0,
		width: 140,
		height: 200
	},
	actions: {
		display: 'flex',
		paddingLeft: theme.spacing(2)
	},
	male: {
		color: '#fff',
		backgroundColor: blue[500]
	},
	female: {
		color: '#fff',
		backgroundColor: pink[500]
	},
	name: {
		display: 'flex'
	},
	scoreChip: {
		marginLeft: theme.spacing(1),
		color: '#fff',
		backgroundColor: red[500]
	}
}));

export default function StaticPatientCard({loading, found, patient}) {
	const classes = useStyles();

	const {_id, birthdate, photo, niss, score} = patient;

	const firstname = patient.firstname || '?';
	const lastname = patient.lastname || '?';
	const sex = patient.sex || 'N';

	const photoTransition = useTransition([photo], {
		from: {opacity: 0},
		enter: {opacity: 1},
		leave: {opacity: 0}
	});

	const deleted = !loading && !found;

	const cardOpacity = {opacity: deleted ? 0.4 : 1};

	return (
		<Card
			className={classes.card}
			component={Link}
			to={`/patient/${_id}`}
			style={cardOpacity}
		>
			{deleted && <div className={classes.veil}>DELETED</div>}
			<div className={classes.details}>
				<CardHeader
					className={classes.header}
					avatar={
						<Avatar className={classes[sex]}>
							{sex.slice(0, 1).toUpperCase()}
						</Avatar>
					}
					title={`${lastname.toUpperCase()} ${firstname}`}
					subheader={eidFormatBirthdate(birthdate)}
				/>
				<CardContent className={classes.content} />
				<CardActions disableSpacing className={classes.actions}>
					<Chip label={niss || '?'} />
					{score && (
						<Chip
							className={classes.scoreChip}
							label={`Search score: ${score.toFixed(3)}`}
						/>
					)}
				</CardActions>
			</div>
			{photoTransition((style, item) =>
				item ? (
					<CardMedia
						component={animated.div}
						className={classes.photo}
						image={`data:image/png;base64,${item}`}
						title={`${firstname} ${lastname}`}
						style={style}
					/>
				) : (
					<animated.div className={classes.photoPlaceHolder} style={style}>
						{firstname[0]}
						{lastname[0]}
					</animated.div>
				)
			)}
		</Card>
	);
}

StaticPatientCard.projection = {
	firstname: 1,
	lastname: 1,
	birthdate: 1,
	sex: 1,
	niss: 1,
	photo: 1
};

StaticPatientCard.defaultProps = {
	loading: false,
	found: true
};

StaticPatientCard.propTypes = {
	loading: PropTypes.bool,
	found: PropTypes.bool,
	patient: PropTypes.object.isRequired
};
