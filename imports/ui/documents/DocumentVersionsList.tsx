import React, {useMemo} from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../util/uri';

import DocumentsList from './DocumentsList';

type Params = {
	identifier: string;
	reference: string;
};

type Props = {
	readonly page?: number;
	readonly perpage?: number;
};

const sort = {
	status: 1,
	datetime: -1,
} as const;

const DocumentsVersionsList = ({page = 1, perpage = 10}: Props) => {
	const params = useParams<Params>();
	const identifier = myDecodeURIComponent(params.identifier);
	const reference = myDecodeURIComponent(params.reference);

	const filter = useMemo(
		() => ({identifier, reference}),
		[identifier, reference],
	);

	return (
		<DocumentsList filter={filter} sort={sort} page={page} perpage={perpage} />
	);
};

export default DocumentsVersionsList;
