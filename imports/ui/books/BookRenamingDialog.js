import React from 'react';
import PropTypes from 'prop-types';

import TagRenamingDialog from '../tags/TagRenamingDialog.js';

import {Books, books} from '../../api/books.js';

export default function BookRenamingDialog({open, onClose, onRename, tag}) {
	return (
		<TagRenamingDialog
			open={open}
			title="book"
			collection={Books}
			subscription="books"
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
