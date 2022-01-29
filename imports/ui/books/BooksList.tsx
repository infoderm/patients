import React, {useState} from 'react';
import {match} from 'react-router-dom';

import SaveIcon from '@material-ui/icons/Save';
import SwapVertIcon from '@material-ui/icons/SwapVert';

import dateFormat from 'date-fns/format';

import TagList from '../tags/TagList';

import {useBooks} from '../../api/books';
import {useSettingCached} from '../settings/hooks';

import YearJumper from '../navigation/YearJumper';
import FixedFab from '../button/FixedFab';
import BookCard from './BookCard';
import BooksDownloadDialog from './BooksDownloadDialog';

interface Params {
	year?: string;
	page?: string;
}

interface Props {
	match?: match<Params>;
	year?: string;
	page?: number;
	perpage?: number;
}

const BooksList = ({match, year, page = 1, perpage = 10}: Props) => {
	const [downloading, setDownloading] = useState(false);
	const {value: sortingOrder, setValue: setSortingOrder} = useSettingCached(
		'books-sorting-order',
	);

	page = Number.parseInt(match?.params.page, 10) || page;
	year = match?.params.year || year || dateFormat(new Date(), 'yyyy');

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
				onClick={() => {
					setDownloading(true);
				}}
			>
				<SaveIcon />
			</FixedFab>
			<FixedFab
				col={5}
				color="default"
				tooltip="Toggle sorting order"
				onClick={async () => {
					await setSortingOrder(-sortingOrder);
				}}
			>
				<SwapVertIcon />
			</FixedFab>
			<BooksDownloadDialog
				initialBegin={initialBegin}
				open={downloading}
				onClose={() => {
					setDownloading(false);
				}}
			/>
		</div>
	);
};

export default BooksList;
