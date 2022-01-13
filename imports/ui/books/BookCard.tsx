import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import orange from '@material-ui/core/colors/orange';

import StaticTagCard from '../tags/StaticTagCard';

import {books} from '../../api/books';

import {myEncodeURIComponent} from '../../util/uri';

import {useDateFormatRange} from '../../i18n/datetime';
import useBookStats from './useBookStats';

import BookRenamingDialog from './BookRenamingDialog';

const useStyles = makeStyles(() => ({
	avatar: {
		color: '#fff',
		backgroundColor: orange[500],
	},
	content: {
		lineHeight: 1.35,
	},
}));

export default function BookCard({item}) {
	const classes = useStyles();

	const dateFormatRange = useDateFormatRange('PPP');

	const [year, book] = books.split(item.name);

	const {loading, found, result} = useBookStats(item.name);
	const {count, total, first, last} = result ?? {};

	const subheader = found ? `${count} consultations` : '...';

	const content =
		count === undefined ? (
			<Typography className={classes.content} variant="body1">
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
		<StaticTagCard
			loading={loading}
			found={found}
			tag={item}
			url={(_name) => `/book/${year}/${myEncodeURIComponent(book)}`}
			subheader={subheader}
			content={content}
			avatar={<Avatar className={classes.avatar}>Bk</Avatar>}
			abbr={`/${book.slice(0, 2)}`}
			RenamingDialog={BookRenamingDialog}
		/>
	);
}

BookCard.propTypes = {
	item: PropTypes.object.isRequired,
};
