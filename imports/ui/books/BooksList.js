import React, {useState} from 'react';
import PropTypes from 'prop-types';

import SaveIcon from '@material-ui/icons/Save';
import SwapVertIcon from '@material-ui/icons/SwapVert';

import dateFormat from 'date-fns/format';

import TagList from '../tags/TagList';

import {useBooks} from '../../api/books';
import {useSettingCached} from '../../client/settings';

import YearJumper from '../navigation/YearJumper';
import FixedFab from '../button/FixedFab';
import BookCard from './BookCard';
import BooksDownloadDialog from './BooksDownloadDialog';

export default function BooksList({match, year, page, perpage}) {
	const [downloading, setDownloading] = useState(false);
	const {value: sortingOrder, setValue: setSortingOrder} = useSettingCached(
		'books-sorting-order',
	);

	const now = new Date();
	page =
		(match && match.params.page && Number.parseInt(match.params.page, 10)) ||
		page;
	year = (match && match.params.year) || year || dateFormat(now, 'yyyy');

	const _year = Number.parseInt(year, 10);

	const query = {fiscalYear: _year};

	const initialBegin = new Date(_year, 0, 1);

	const sort = {fiscalYear: 1, bookNumber: sortingOrder};

	return (
		<div>
			<YearJumper current={_year} toURL={(x) => `/books/${x}`} />
			<TagList
				page={page}
				perpage={perpage}
				Card={BookCard}
				url={match.url}
				query={query}
				sort={sort}
				useTags={useBooks}
			/>
			<FixedFab
				col={4}
				color="secondary"
				tooltip="Download books"
				onClick={() => setDownloading(true)}
			>
				<SaveIcon />
			</FixedFab>
			<FixedFab
				col={5}
				color="default"
				tooltip="Toggle sorting order"
				onClick={() => setSortingOrder(-sortingOrder)}
			>
				<SwapVertIcon />
			</FixedFab>
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
	perpage: 10,
};

BooksList.propTypes = {
	year: PropTypes.string,
	page: PropTypes.number,
	perpage: PropTypes.number,
};
