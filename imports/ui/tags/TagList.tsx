import React from 'react';
import {useParams} from 'react-router-dom';

import {parseNonNegativeIntegerStrictOrUndefined} from '../../api/string';
import PropsOf from '../../util/PropsOf';
import TagListPage from './TagListPage';

type Props = Omit<PropsOf<typeof TagListPage>, 'page'>;

const TagList = (props: Props) => {
	const params = useParams<{page?: string}>();
	const page = parseNonNegativeIntegerStrictOrUndefined(params.page);
	return <TagListPage page={page} {...props} />;
};

export default TagList;
