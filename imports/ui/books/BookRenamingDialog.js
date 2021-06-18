import React from 'react';
import PropTypes from 'prop-types';

import TagRenamingDialog from '../tags/TagRenamingDialog';

import {books, useBooksFind} from '../../api/books';

export default function BookRenamingDialog({open, onClose, onRename, tag}) {
	return (
		<TagRenamingDialog
			open={open}
			title="book"
			useTagsFind={useBooksFind}
			method="books.changeBookNumber"
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
}

BookRenamingDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onRename: PropTypes.func.isRequired,
	tag: PropTypes.object.isRequired
};
