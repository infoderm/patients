import React from 'react';
import {useParams} from 'react-router-dom';

import {type TagNameFields, type TagMetadata} from '../../api/tags/TagDocument';
import {parseNonNegativeIntegerStrictOrUndefined} from '../../api/string';
import TagListPage, {type TagListPageProps} from './TagListPage';

type TagListProps<T extends TagNameFields & TagMetadata> = Omit<
	TagListPageProps<T>,
	'page'
>;

const TagList = <T extends TagNameFields & TagMetadata>(
	props: TagListProps<T>,
) => {
	const params = useParams<{page?: string}>();
	const page =
		params.page === undefined
			? undefined
			: parseNonNegativeIntegerStrictOrUndefined(params.page);
	return <TagListPage page={page} {...props} />;
};

export default TagList;
