import React from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import orange from '@material-ui/core/colors/orange';

import TagCard from '../tags/TagCard';

import {books} from '../../api/books';

import {myEncodeURIComponent} from '../../client/uri';

import {useDateFormatRange} from '../../i18n/datetime';

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

	return (
		<TagCard
			tag={item}
			statsCollection={books.cache.Stats}
			statsSubscription={books.options.parentPublicationStats}
			selector={books.selector(item.name)}
			options={{fields: {price: 1, datetime: 1}}}
			url={(_name) => `/book/${year}/${myEncodeURIComponent(book)}`}
			subheader={({count}) =>
				count === undefined ? '...' : `${count} consultations`
			}
			content={({count, total, first, last}) => {
				if (count === undefined)
					return (
						<Typography className={classes.content} variant="body1">
							Total ... <br />
							... — ...
						</Typography>
					);
				if (count === 0) {
					return null;
				}

				return (
					<Typography className={classes.content} variant="body1">
						Total {total} € <br />
						{dateFormatRange(first, last)}
					</Typography>
				);
			}}
			avatar={<Avatar className={classes.avatar}>Bk</Avatar>}
			abbr={`/${book.slice(0, 2)}`}
			RenamingDialog={BookRenamingDialog}
		/>
	);
}

BookCard.propTypes = {
	item: PropTypes.object.isRequired,
};
