import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import rename from '../../api/endpoint/books/rename';

import {books, useBooksFind} from '../../api/books';
import {BookDocument} from '../../api/collection/books';

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: () => void;
	tag: BookDocument;
}

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
