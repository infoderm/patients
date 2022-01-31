import React from 'react';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import rename from '../../api/endpoint/books/rename';

import {books, useBooksFind} from '../../api/books';
import TagDocument from '../../api/tags/TagDocument';

interface Props {
	open: boolean;
	onClose: () => void;
	onRename: () => void;
	tag: TagDocument;
}

const BookRenamingDialog = ({open, onClose, onRename, tag}: Props) => {
	return (
		<TagRenamingDialog
			open={open}
			title="book"
			useTagsFind={useBooksFind}
			endpoint={rename}
			tag={tag}
			nameKey="bookNumber"
			nameKeyTitle="book number"
			nameFormat={(book, bookNumber) =>
				books.format(book.fiscalYear, bookNumber)
			}
			onClose={onClose}
			onRename={onRename}
		/>
	);
};

export default BookRenamingDialog;
