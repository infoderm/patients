import React, {type DependencyList} from 'react';

import Typography from '@mui/material/Typography';

import Center from '../grid/Center';
import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';
import type GenericQueryHook from '../../api/GenericQueryHook';
import useRandom from '../hooks/useRandom';

const ListWithHeader = ({name, Card, List, useItem, listProps}) => {
	const {loading, item} = useItem(name, [name]);

	if (loading) return <Loading />;

	if (!item) return <NoContent>No item named {name}</NoContent>;

	return (
		<div>
			{Card && (
				<div>
					<div style={{paddingBottom: 50, paddingTop: 20}}>
						<Center>
							<Card loading={loading} item={item} />
						</Center>
					</div>
					<Typography variant="h2">Patients</Typography>
				</div>
			)}
			<List {...listProps} />
		</div>
	);
};

type Props<T> = {
	readonly Card?: React.ElementType;

	readonly useItem?: (
		name: string,
		deps: DependencyList,
	) => {loading: boolean; item?: unknown};
	readonly name: string;

	readonly List: React.ElementType;
	readonly listProps?: {};

	readonly useParents: GenericQueryHook<T>;
	readonly filter: {};
	readonly sort: {};
	readonly projection?: {};
	readonly page: number;
	readonly perpage: number;
};

const TagDetails = <T,>(props: Props<T>) => {
	const {
		Card,
		List,
		useItem,
		useParents,
		page,
		perpage,
		name,
		filter,
		sort,
		projection,
	} = props;

	const query = {
		filter,
		projection,
		sort,
		skip: (page - 1) * perpage,
		limit: perpage,
	};

	const [refreshKey, refresh] = useRandom();

	const {loading, results, dirty} = useParents(query, [
		name,
		page,
		perpage,
		refreshKey,
	]);

	const listProps = {
		...props.listProps,
		loading,
		dirty,
		refresh,
		items: results,
		page,
		perpage,
	};

	if (!Card) return <List {...listProps} />;

	if (!useItem) throw new Error('useItem must be given if Card is given');

	return (
		<ListWithHeader
			List={List}
			Card={Card}
			useItem={useItem}
			listProps={listProps}
			name={name}
		/>
	);
};

export default TagDetails;
