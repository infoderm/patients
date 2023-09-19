import React from 'react';
import {styled} from '@mui/material/styles';
import {Link} from 'react-router-dom';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import {emphasize} from '../../lib/color';
import {useDateFormatRange} from '../../i18n/datetime';

import useConsultationsStats from './useConsultationsStats';

const PREFIX = 'ConsultationsStatsCard';

const classes = {
	card: `${PREFIX}-card`,
	details: `${PREFIX}-details`,
	header: `${PREFIX}-header`,
	content: `${PREFIX}-content`,
	photoPlaceHolder: `${PREFIX}-photoPlaceHolder`,
	actions: `${PREFIX}-actions`,
	name: `${PREFIX}-name`,
	avatar: `${PREFIX}-avatar`,
	paragraph: `${PREFIX}-paragraph`,
};

const StyledCard = styled(Card)(({theme}) => ({
	[`&.${classes.card}`]: {
		display: 'flex',
		minHeight: 200,
	},

	[`& .${classes.details}`]: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		minWidth: 300,
	},

	[`& .${classes.header}`]: {
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

	[`& .${classes.content}`]: {
		flex: '1 0 auto',
	},

	[`& .${classes.photoPlaceHolder}`]: {
		display: 'flex',
		fontSize: '4rem',
		margin: 0,
		width: 140,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		color: theme.palette.getContrastText(theme.palette.background.paper),
		backgroundColor: emphasize(theme.palette.background.paper, 0.1),
		flex: 'none',
	},

	[`& .${classes.actions}`]: {
		display: 'flex',
		paddingLeft: theme.spacing(2),
	},

	[`& .${classes.name}`]: {
		display: 'flex',
	},

	[`& .${classes.avatar}`]: {
		color: '#111',
		backgroundColor: 'yellow',
	},

	[`& .${classes.paragraph}`]: {
		lineHeight: 1.35,
	},
}));

type Props = {
	readonly query: {};

	readonly title: string;
	readonly avatar: string;
	readonly url?: string;
	readonly actions?: (item: {}) => React.ReactNode;
	readonly abbr: string;
};

const ConsultationsStatsCard = ({
	query,
	title,
	avatar,
	url = undefined,
	actions = () => null,
	abbr,
}: Props) => {
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
		<StyledCard className={classes.card}>
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
		</StyledCard>
	);
};

export default ConsultationsStatsCard;
