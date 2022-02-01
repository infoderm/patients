import React, {useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';

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
	defaultPage?: number;
	defaultPerpage?: number;
}

const toURL = (x: number) => `/books/${x}`;

const BooksList = ({defaultPage = 1, defaultPerpage = 10}: Props) => {
	const params = useParams<Params>();
	const location = useLocation();
	const [downloading, setDownloading] = useState(false);
	const {value: sortingOrder, setValue: setSortingOrder} = useSettingCached(
		'books-sorting-order',
	);

	const yearString = params.year ?? dateFormat(new Date(), 'yyyy');

	const year = Number.parseInt(yearString, 10);
	const page = Number.parseInt(params.page, 10) || defaultPage;
	const perpage = defaultPerpage;

	const query = {fiscalYear: year};

	const initialBegin = new Date(year, 0, 1);

	const sort = {fiscalYear: 1, bookNumber: sortingOrder};

	return (
		<div>
			<YearJumper current={year} toURL={toURL} />
			<TagList
				page={page}
				perpage={perpage}
				Card={BookCard}
				url={location.pathname}
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
