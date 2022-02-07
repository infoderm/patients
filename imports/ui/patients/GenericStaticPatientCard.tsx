import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import {useTransition, animated} from 'react-spring';

import makeStyles from '@mui/styles/makeStyles';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import blue from '@mui/material/colors/blue';
import pink from '@mui/material/colors/pink';
import red from '@mui/material/colors/red';
import yellow from '@mui/material/colors/yellow';

import {dataURL as pngDataURL} from '../../util/png';

import eidDisplayBirthdate from '../../api/eidDisplayBirthdate';
import {useDateFormat} from '../../i18n/datetime';

const useStyles = makeStyles((theme) => ({
	card: {
		position: 'relative',
		transition: 'opacity 500ms ease-out',
		display: 'flex',
		minHeight: 200,
		minWidth: 400,
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
		fontSize: '2rem',
	},
	details: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
	},
	header: {
		flex: '1 0 auto',
	},
	content: {
		flex: '1 0 auto',
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
		backgroundColor: '#999',
	},
	photo: {
		position: 'absolute',
		right: 0,
		top: 0,
		width: 140,
		height: 200,
	},
	actions: {
		display: 'flex',
		paddingLeft: theme.spacing(2),
	},
	male: {
		color: '#fff',
		backgroundColor: blue[500],
	},
	female: {
		color: '#fff',
		backgroundColor: pink[500],
	},
	name: {
		display: 'flex',
	},
	scoreChip: {
		marginLeft: theme.spacing(1),
		color: '#fff',
		backgroundColor: red[500],
	},
}));

const GenericStaticPatientCard = ({
	loading,
	found,
	patient,
	highlightNn,
	showScore,
	...rest
}: InferProps<typeof GenericStaticPatientCard.propTypes>) => {
	const classes = useStyles();

	const localizeBirthdate = useDateFormat('PPPP');

	const {birthdate, photo, niss, score} = patient;

	const firstname = patient.firstname || '?';
	const lastname = patient.lastname || '?';
	const sex = patient.sex || 'N';

	const photoTransition = useTransition([photo], {
		from: {opacity: 0},
		enter: {opacity: 1},
		leave: {opacity: 0},
	});

	const deleted = !loading && !found;

	const nnStyle = highlightNn
		? {
				backgroundColor:
					typeof highlightNn === 'string' ? highlightNn : yellow[200],
		  }
		: {};

	const cardOpacity = {opacity: deleted ? 0.4 : 1};

	return (
		<Card className={classes.card} style={cardOpacity} {...rest}>
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
					subheader={eidDisplayBirthdate(birthdate, localizeBirthdate)}
				/>
				<CardContent className={classes.content} />
				<CardActions disableSpacing className={classes.actions}>
					<Chip style={nnStyle} label={niss || '?'} />
					{showScore && score && (
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
						image={pngDataURL(item)}
						title={`${firstname} ${lastname}`}
						style={style as unknown as React.CSSProperties}
					/>
				) : (
					<animated.div className={classes.photoPlaceHolder} style={style}>
						{firstname[0]}
						{lastname[0]}
					</animated.div>
				),
			)}
		</Card>
	);
};

GenericStaticPatientCard.projection = {
	firstname: 1,
	lastname: 1,
	birthdate: 1,
	sex: 1,
	niss: 1,
	photo: 1,
};

GenericStaticPatientCard.defaultProps = {
	loading: false,
	found: true,
	highlightNn: false,
	showScore: false,
};

GenericStaticPatientCard.propTypes = {
	loading: PropTypes.bool,
	found: PropTypes.bool,
	highlightNn: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
	showScore: PropTypes.bool,
	patient: PropTypes.object.isRequired,
};

export default GenericStaticPatientCard;
