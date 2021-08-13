import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes, {InferProps} from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import {useDateFormatRange} from '../../i18n/datetime';

import useConsultationsStats from './useConsultationsStats';

const useStyles = makeStyles((theme) => ({
	card: {
		display: 'flex',
		minHeight: 200,
	},
	details: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minWidth: 300,
	},
	header: {
		flex: 1,
		'& > div': {
			minWidth: 0,
			'& > span': {
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
			},
		},
	},
	content: {
		flex: '1 0 auto',
	},
	photoPlaceHolder: {
		display: 'flex',
		fontSize: '4rem',
		margin: 0,
		width: 140,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		color: '#fff',
		backgroundColor: '#999',
		flex: 'none',
	},
	actions: {
		display: 'flex',
		paddingLeft: theme.spacing(2),
	},
	name: {
		display: 'flex',
	},
	avatar: {
		color: '#111',
		backgroundColor: 'yellow',
	},
	paragraph: {
		lineHeight: 1.35,
	},
}));

const ConsultationsStatsCardPropTypes = {
	query: PropTypes.object.isRequired,

	title: PropTypes.string.isRequired,
	avatar: PropTypes.string.isRequired,
	url: PropTypes.string,
	actions: PropTypes.func,
	abbr: PropTypes.string.isRequired,
};

type Props = InferProps<typeof ConsultationsStatsCardPropTypes>;

const ConsultationsStatsCard = ({
	query,
	title,
	avatar,
	url = undefined,
	actions = () => null,
	abbr,
}: Props) => {
	const classes = useStyles();
	const dateFormatRange = useDateFormatRange('PPP');
	const {result} = useConsultationsStats(query);
	const {count, total, first, last} = result ?? {};

	const subheader = count === undefined ? '...' : `${count} consultations`;

	const content =
		count === undefined ? (
			<Typography className={classes.paragraph} variant="body1">
				Total ... <br />
				... — ...
			</Typography>
		) : count === 0 ? null : (
			<Typography className={classes.content} variant="body1">
				Total {total} € <br />
				{dateFormatRange(first, last)}
			</Typography>
		);

	return (
		<Card className={classes.card}>
			<div className={classes.details}>
				<CardHeader
					className={classes.header}
					avatar={<Avatar className={classes.avatar}>{avatar}</Avatar>}
					title={title}
					subheader={subheader}
					component={Link}
					to={url}
				/>
				<CardContent className={classes.content}>{content}</CardContent>
				<CardActions disableSpacing className={classes.actions}>
					{actions(result ?? {})}
				</CardActions>
			</div>
			<div className={classes.photoPlaceHolder}>{abbr || title.slice(-2)}</div>
		</Card>
	);
};

ConsultationsStatsCard.propTypes = ConsultationsStatsCardPropTypes;

export default ConsultationsStatsCard;
