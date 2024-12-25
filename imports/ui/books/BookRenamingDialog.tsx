import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import rename from '../../api/endpoint/books/rename';

import {books} from '../../api/books';
import {type BookDocument} from '../../api/collection/books';

import useBooksFind from './useBooksFind';

type Props = {
	readonly open: boolean;
	readonly onClose: () => void;
	readonly onRename: () => void;
	readonly tag: BookDocument;
};

const BookRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
	return (
		<TagRenamingDialog
			open={open}
			title="book"
			useTagsFind={useBooksFind}
			suggestionFilter={{fiscalYear: tag.fiscalYear}}
			endpoint={rename}
			tag={tag}
			nameKey="bookNumber"
			nameKeyTitle="book number"
			nameFormat={(book: BookDocument, bookNumber: string) =>
				books.format(book.fiscalYear, bookNumber)
			}
			onClose={onClose}
			onRename={onRename}
		/>
	);
};

export default BookRenamingDialog;
