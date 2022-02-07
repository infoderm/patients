import React, {DependencyList, useState} from 'react';

import Typography from '@material-ui/core/Typography';

import Center from '../grid/Center';
import Loading from '../navigation/Loading';
import NoContent from '../navigation/NoContent';

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

interface Props {
	Card?: React.ElementType;

	useItem?: (
		name: string,
		deps: DependencyList,
	) => {loading: boolean; item?: unknown};
	name: string;

	List: React.ElementType;
	listProps?: {};

	useParents: (
		selector: unknown,
		options: unknown,
		deps: DependencyList,
	) => {loading: boolean; results: unknown[]; dirty?: boolean};
	selector: {};
	sort: {};
	fields?: {};
	page: number;
	perpage: number;
}

const TagDetails = (props: Props) => {
	const {
		Card,
		List,
		useItem,
		useParents,
		page,
		perpage,
		name,
		selector,
		sort,
		fields,
	} = props;

	const options = {
		fields,
		sort,
		skip: (page - 1) * perpage,
		limit: perpage,
	};

	const [refreshKey, setRefreshKey] = useState(Math.random());
	const refresh = () => {
		setRefreshKey(Math.random());
	};

	const {loading, results, dirty} = useParents(selector, options, [
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
