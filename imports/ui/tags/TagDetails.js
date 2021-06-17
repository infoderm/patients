import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import Center from '../grid/Center.js';
import Loading from '../navigation/Loading.js';
import NoContent from '../navigation/NoContent.js';

const ListWithHeader = (props) => {
	const {name, Card, List, useItem, listProps, root, page, perpage} = props;

	const {loading, item} = useItem(name);

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
			<List {...listProps} root={root} page={page} perpage={perpage} />
		</div>
	);
};

const TagDetails = (props) => {
	const {
		Card,
		List,
		useItem,
		useParents,
		root,
		page,
		perpage,
		name,
		selector,
		sort,
		fields
	} = props;

	const options = {
		fields,
		sort,
		skip: (page - 1) * perpage,
		limit: perpage
	};

	const [refreshKey, setRefreshKey] = useState(Math.random());
	const refresh = () => setRefreshKey(Math.random());
	const {loading, results, dirty} = useParents(selector, options, [
		name,
		page,
		perpage,
		refreshKey
	]);

	const listProps = {
		...props.listProps,
		loading,
		dirty,
		refresh,
		items: results
	};

	if (!Card)
		return <List {...listProps} root={root} page={page} perpage={perpage} />;

	if (!useItem) throw new Error('useItem must be given if Card is given');

	return <ListWithHeader {...props} listProps={listProps} />;
};

TagDetails.propTypes = {
	Card: PropTypes.elementType,

	useItem: PropTypes.func,
	name: PropTypes.string.isRequired,

	List: PropTypes.elementType.isRequired,
	listProps: PropTypes.object,
	root: PropTypes.string.isRequired,

	useParents: PropTypes.func.isRequired,
	selector: PropTypes.object.isRequired,
	sort: PropTypes.object.isRequired,
	fields: PropTypes.object,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired
};

export default TagDetails;
