import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

import {useParams} from 'react-router-dom';
import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

import {myDecodeURIComponent} from '../../util/uri';
import useDrug from './useDrug';

const styles = (theme) => ({
	container: {
		padding: theme.spacing(3),
	},
});

const useStyles = makeStyles(styles);

type Params = {
	id: string;
};

const DrugDetails = () => {
	const classes = useStyles();
	const params = useParams<Params>();
	const drugId = myDecodeURIComponent(params.id);
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
		<div>
			<div className={classes.container}>
				<pre>{JSON.stringify(drug, null, 4)}</pre>
			</div>
		</div>
	);
};

export default DrugDetails;
