import React, {useMemo} from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../util/uri';

import DocumentsList from './DocumentsList';

type Params = {
	identifier: string;
};

type Props = {
	readonly page?: number;
	readonly perpage?: number;
};

const sort = {
	datetime: -1,
} as const;

const DocumentsFromIdentifierList = ({page = 1, perpage = 10}: Props) => {
	const params = useParams<Params>();
	const identifier = myDecodeURIComponent(params.identifier);

	const filter = useMemo(() => ({identifier}), [identifier]);

	return (
		<DocumentsList filter={filter} sort={sort} page={page} perpage={perpage} />
	);
};

export default DocumentsFromIdentifierList;
