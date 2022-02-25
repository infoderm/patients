import React from 'react';
import {useParams} from 'react-router-dom';

import {TagNameFields, TagMetadata} from '../../api/tags/TagDocument';
import {parseNonNegativeIntegerStrictOrUndefined} from '../../api/string';
import TagListPage, {TagListPageProps} from './TagListPage';

type TagListProps<T> = Omit<TagListPageProps<T>, 'page'>;

const TagList = <T extends TagNameFields & TagMetadata>(
	props: TagListProps<T>,
) => {
	const params = useParams<{page?: string}>();
	const page = parseNonNegativeIntegerStrictOrUndefined(params.page);
	return <TagListPage page={page} {...props} />;
};

export default TagList;
