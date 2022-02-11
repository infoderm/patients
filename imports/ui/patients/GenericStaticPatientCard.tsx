import React from 'react';
import {styled} from '@mui/material/styles';

import {useTransition, animated} from 'react-spring';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';

import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

import {blue, pink, red, yellow} from '@mui/material/colors';

import {dataURL as pngDataURL} from '../../util/png';

import eidDisplayBirthdate from '../../api/eidDisplayBirthdate';
import {useDateFormat} from '../../i18n/datetime';
import PropsOf from '../../util/PropsOf';
import {PatientDocument} from '../../api/collection/patients';

const PREFIX = 'GenericStaticPatientCard';

const classes = {
	card: `${PREFIX}-card`,
	veil: `${PREFIX}-veil`,
	details: `${PREFIX}-details`,
	header: `${PREFIX}-header`,
	content: `${PREFIX}-content`,
	photoContainer: `${PREFIX}-photoContainer`,
	photoPlaceHolder: `${PREFIX}-photoPlaceHolder`,
	photo: `${PREFIX}-photo`,
	actions: `${PREFIX}-actions`,
	male: `${PREFIX}-male`,
	female: `${PREFIX}-female`,
	name: `${PREFIX}-name`,
	scoreChip: `${PREFIX}-scoreChip`,
	deadChip: `${PREFIX}-deadChip`,
};

const StyledCard = styled(Card)(({theme}) => ({
	[`&.${classes.card}`]: {
		position: 'relative',
		transition: 'opacity 500ms ease-out',
		display: 'flex',
		minHeight: 200,
		minWidth: 400,
	},

	[`& .${classes.veil}`]: {
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

	[`& .${classes.details}`]: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
	},

	[`& .${classes.header}`]: {
		flex: '1 0 auto',
	},

	[`& .${classes.content}`]: {
		flex: '1 0 auto',
	},

	[`& .${classes.photoContainer}`]: {
		position: 'relative',
		display: 'flex',
		margin: 0,
		width: 140,
	},

	[`& .${classes.photoPlaceHolder}`]: {
		position: 'absolute',
		display: 'flex',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		fontSize: '4rem',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff',
		backgroundColor: '#999',
	},

	[`& .${classes.photo}`]: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},

	[`& .${classes.actions}`]: {
		display: 'flex',
		paddingLeft: theme.spacing(2),
	},

	[`& .${classes.male}`]: {
		color: '#fff',
		backgroundColor: blue[500],
	},

	[`& .${classes.female}`]: {
		color: '#fff',
		backgroundColor: pink[500],
	},

	[`& .${classes.name}`]: {
		display: 'flex',
	},

	[`& .${classes.scoreChip}`]: {
		marginLeft: theme.spacing(1),
		color: '#fff',
		backgroundColor: red[500],
	},

	[`& .${classes.deadChip}`]: {
		marginLeft: theme.spacing(1),
	},
}));

const projection = {
	firstname: 1,
	lastname: 1,
	deathdateModifiedAt: 1,
	birthdate: 1,
	sex: 1,
	niss: 1,
	photo: 1,
};

type Projection = typeof projection;

interface GenericStaticPatientCardProps extends PropsOf<typeof StyledCard> {
	patient: Pick<PatientDocument, keyof Projection> & {score?: number};
	loading?: boolean;
	found?: boolean;
	highlightNn?: boolean | string;
	showScore?: boolean;
}

const GenericStaticPatientCard = ({
	patient,
	loading = false,
	found = true,
	highlightNn = false,
	showScore = false,
	...rest
}: GenericStaticPatientCardProps) => {
	const localizeBirthdate = useDateFormat('PPPP');

	const {birthdate, photo, niss, score} = patient;

	const firstname = patient.firstname || '?';
	const lastname = patient.lastname || '?';
	const sex = patient.sex || 'N';

	const isDead = patient.deathdateModifiedAt instanceof Date;

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
		<StyledCard className={classes.card} style={cardOpacity} {...rest}>
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
					{isDead && (
						<Chip
							className={classes.deadChip}
							icon={<HeartBrokenIcon />}
							label={`Décédé${sex === 'female' ? 'e' : ''}`}
						/>
					)}
				</CardActions>
			</div>
			<div className={classes.photoContainer}>
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
			</div>
		</StyledCard>
	);
};

GenericStaticPatientCard.projection = projection;

export default GenericStaticPatientCard;
