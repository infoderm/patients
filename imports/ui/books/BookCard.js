import React from 'react';
import PropTypes from 'prop-types';

import dateFormat from 'date-fns/format';

import {map, filter, sum, min, max} from '@aureooms/js-itertools';

import {makeStyles} from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import orange from '@material-ui/core/colors/orange';

import TagCard from '../tags/TagCard.js';

import {Consultations} from '../../api/consultations.js';

import {books} from '../../api/books.js';

import {myEncodeURIComponent} from '../../client/uri.js';

const useStyles = makeStyles(() => ({
	avatar: {
		color: '#fff',
		backgroundColor: orange[500]
	}
}));

export default function BookCard({item}) {
	const classes = useStyles();

	const [year, book] = books.split(item.name);

	return (
		<TagCard
			tag={item}
			collection={Consultations}
			subscription="book.consultations"
			selector={books.selector(item.name)}
			options={{fields: {price: 1, datetime: 1}}}
			limit={0}
			url={(_name) => `/book/${year}/${myEncodeURIComponent(book)}`}
			subheader={(count) => `${count} consultations`}
			content={(count, consultations) => {
				if (count === 0) {
					return null;
				}

				const total = sum(
					filter(
						(x) => Boolean(x),
						map((c) => c.price, consultations)
					)
				);
				const first = min(
					(a, b) => a - b,
					map((c) => c.datetime, consultations)
				);
				const last = max(
					(a, b) => a - b,
					map((c) => c.datetime, consultations)
				);
				const fmt = 'MMM do, yyyy';
				return (
					<Typography variant="body1">
						Total {total} € <br />
						From {dateFormat(first, fmt)} to {dateFormat(last, fmt)}.
					</Typography>
				);
			}}
			avatar={<Avatar className={classes.avatar}>Bk</Avatar>}
			abbr={`/${book.slice(0, 2)}`}
		/>
	);
}

BookCard.propTypes = {
	item: PropTypes.object.isRequired
};
