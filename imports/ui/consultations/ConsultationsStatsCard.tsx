import React from 'react';
import {Link} from 'react-router-dom';

import makeStyles from '@mui/styles/makeStyles';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

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

interface Props {
	query: {};

	title: string;
	avatar: string;
	url?: string;
	actions?: (item: {}) => React.ReactNode;
	abbr: string;
}

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
					component={url ? Link : undefined}
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

export default ConsultationsStatsCard;
