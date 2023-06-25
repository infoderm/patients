import React, {useState} from 'react';
import {Route, Routes} from 'react-router-dom';

import SaveIcon from '@mui/icons-material/Save';
import SwapVertIcon from '@mui/icons-material/SwapVert';

import dateFormat from 'date-fns/format';

import TagList from '../tags/TagList';

import {useBooks} from '../../api/books';
import {useSettingCached} from '../settings/hooks';

import YearJumper from '../navigation/YearJumper';
import NoMatch from '../navigation/NoMatch';
import FixedFab from '../button/FixedFab';

import BookCard from './BookCard';
import BooksDownloadDialog from './BooksDownloadDialog';

type Props = {
	type?: string;
	filter?: string;
	defaultPerpage?: number;
};

const BooksList = ({
	type = undefined,
	filter = undefined,
	defaultPerpage = 10,
}: Props) => {
	const [downloading, setDownloading] = useState(false);
	const {value: sortingOrder, setValue: setSortingOrder} = useSettingCached(
		'books-sorting-order',
	);

	if (type !== undefined && type !== 'year') return <NoMatch />;

	const yearString = filter ?? dateFormat(new Date(), 'yyyy');
	const year = Number.parseInt(yearString, 10);

	const perpage = defaultPerpage;

	const concreteFilter = {fiscalYear: year};

	const initialBegin = new Date(year, 0, 1);

	const sort = {fiscalYear: 1, bookNumber: sortingOrder} as const;

	const list = (
		<TagList
			perpage={perpage}
			Card={BookCard}
			filter={concreteFilter}
			sort={sort}
			useTags={useBooks}
		/>
	);

	return (
		<div>
			<YearJumper
				current={year}
				toURL={(x: number) =>
					`${year === undefined ? '' : '../'}query/year/${x}`
				}
			/>
			<Routes>
				<Route index element={list} />
				<Route path="page/:page" element={list} />
			</Routes>
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
				tooltip="Toggle sorting order"
				onClick={async () => {
					await setSortingOrder(-sortingOrder as -1 | 1);
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
