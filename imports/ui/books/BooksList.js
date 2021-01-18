import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SaveIcon from '@material-ui/icons/Save';

import dateFormat from 'date-fns/format';

import TagList from '../tags/TagList.js';

import BooksDownloadDialog from './BooksDownloadDialog.js';

import BookCard from './BookCard.js';
import {useBooks} from '../../api/books.js';

import YearJumper from '../navigation/YearJumper.js';
import {computeFixedFabStyle} from '../button/FixedFab.js';

const useStyles = makeStyles((theme) => ({
	saveButton: computeFixedFabStyle({theme, col: 4})
}));

export default function BooksList({match, year, page, perpage}) {
	const classes = useStyles();

	const [downloading, setDownloading] = useState(false);

	const now = new Date();
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;
	year = (match && match.params.year) || year || dateFormat(now, 'yyyy');

	const _year = Number.parseInt(year, 10);

	const query = {fiscalYear: _year};

	const initialBegin = new Date(_year, 0, 1);

	return (
		<div>
			<YearJumper current={_year} toURL={(x) => `/books/${x}`} />
			<TagList
				page={page}
				perpage={perpage}
				Card={BookCard}
				url={match.url}
				query={query}
				sort={{fiscalYear: 1, bookNumber: -1}}
				useTags={useBooks}
			/>
			<Fab
				className={classes.saveButton}
				color="secondary"
				onClick={() => setDownloading(true)}
			>
				<SaveIcon />
			</Fab>
			<BooksDownloadDialog
				initialBegin={initialBegin}
				open={downloading}
				onClose={() => setDownloading(false)}
			/>
		</div>
	);
}

BooksList.defaultProps = {
	page: 1,
	perpage: 10
};

BooksList.propTypes = {
	year: PropTypes.string,
	page: PropTypes.number,
	perpage: PropTypes.number
};
