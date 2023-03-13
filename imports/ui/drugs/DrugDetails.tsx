import React from 'react';
import {styled} from '@mui/material/styles';

import {useParams} from 'react-router-dom';
import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {myDecodeURIComponent} from '../../lib/uri';
import useDrug from './useDrug';

const PREFIX = 'DrugDetails';

const classes = {
	container: `${PREFIX}-container`,
};

const Root = styled('div')(({theme}) => ({
	[`& .${classes.container}`]: {
		padding: theme.spacing(3),
	},
}));

type Params = {
	id: string;
};

const DrugDetails = () => {
	const params = useParams<Params>();
	const drugId = myDecodeURIComponent(params.id)!;
	const {
		loading,
		found,
		fields: drug,
	} = useDrug(
		{
			_id: drugId,
		},
		drugId,
		{},
		[drugId],
	);

	if (loading) {
		return <Loading />;
	}

	if (!found) {
		return <NoContent>Drug not found.</NoContent>;
	}

	return (
		<Root>
			<div className={classes.container}>
				<pre>{JSON.stringify(drug, null, 4)}</pre>
			</div>
		</Root>
	);
};

export default DrugDetails;
