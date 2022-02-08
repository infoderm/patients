import React from 'react';

import {styled} from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import orange from '@mui/material/colors/orange';

import StaticTagCard from '../tags/StaticTagCard';

import {books} from '../../api/books';

import {myEncodeURIComponent} from '../../util/uri';

import {useDateFormatRange} from '../../i18n/datetime';
import useBookStats from './useBookStats';

import BookRenamingDialog from './BookRenamingDialog';

const BookAvatar = styled(Avatar)({
	color: '#fff',
	backgroundColor: orange[500],
});

interface Props {
	item: {
		name: string;
	};
}

const BookCard = ({item}: Props) => {
	const dateFormatRange = useDateFormatRange('PPP');

	const [year, book] = books.split(item.name);

	const {loading, found, result} = useBookStats(item.name);
	const {count, total, first, last} = result ?? {};

	const subheader = found ? `${count} consultations` : '...';

	const content =
		count === undefined ? (
			<Typography variant="body1">
				Total ... <br />
				... — ...
			</Typography>
		) : count === 0 ? null : (
			<Typography variant="body1">
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
			avatar={<BookAvatar>Bk</BookAvatar>}
			abbr={`/${book.slice(0, 2)}`}
			RenamingDialog={BookRenamingDialog}
		/>
	);
};

export default BookCard;
