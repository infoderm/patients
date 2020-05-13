import React from 'react' ;
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom' ;

import dateFormat from 'date-fns/format' ;

import { map } from '@aureooms/js-itertools' ;
import { filter } from '@aureooms/js-itertools' ;
import { sum } from '@aureooms/js-itertools' ;
import { min } from '@aureooms/js-itertools' ;
import { max } from '@aureooms/js-itertools' ;

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import orange from '@material-ui/core/colors/orange';

import TagCard from '../tags/TagCard.js';

import { Consultations } from '../../api/consultations.js';

import { books } from '../../api/books.js';

const styles = theme => ({
	avatar: {
		color: '#fff',
		backgroundColor: orange[500],
	},
});

function BookCard ( { classes , item } ) {

	const [ year , book ] = books.split(item.name) ;

	return (
		<TagCard
			tag={item}
			collection={Consultations}
			subscription="book.consultations"
			selector={books.selector(item.name)}
			url={name => `/book/${name}`}
			subheader={consultations => `${consultations.length} consultations`}
			content={
				consultations => {
					const total = sum(filter(x => !!x, map(c => c.price, consultations)));
					const first = min((a, b) => a - b, map(c => c.datetime, consultations));
					const last = max((a, b) => a - b, map(c => c.datetime, consultations));
					const fmt = 'MMM do, yyyy';
					return (
						<Typography variant="body1">
							Total {total} € <br/>
							From {dateFormat(first, fmt)} to {dateFormat(last,fmt)}.
						</Typography>
					) ;
				}
			}
			avatar={<Avatar className={classes.avatar}>Bk</Avatar>}
			abbr={`/${book.slice(0,2)}`}
		/>
	) ;

}

BookCard.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,

	item: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true})(BookCard) ;
