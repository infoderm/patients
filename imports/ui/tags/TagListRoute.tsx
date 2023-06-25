import React from 'react';
import {useParams} from 'react-router-dom';

import {myDecodeURIComponent} from '../../lib/uri';

type Params = {
	type?: string;
	filter?: string;
};

type Props = {
	List: React.ElementType<Params>;
};

const TagListRoute = ({List}: Props) => {
	const params = useParams<Params>();
	const type = myDecodeURIComponent(params.type);
	const filter = myDecodeURIComponent(params.filter);
	return <List type={type} filter={filter} />;
};

export default TagListRoute;
