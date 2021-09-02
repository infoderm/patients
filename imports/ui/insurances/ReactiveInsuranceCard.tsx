import React from 'react';

import useCachedInsurance from './useCachedInsurance';

import StaticInsuranceCard from './StaticInsuranceCard';

const ReactiveInsuranceCard = ({item}) => {
	const init = {...item};
	const {name} = item;
	const query = {name};
	const options = {};
	const deps = [name];
	const {loading, found, fields} = useCachedInsurance(
		init,
		query,
		options,
		deps,
	);
	return <StaticInsuranceCard loading={loading} found={found} item={fields} />;
};

export default ReactiveInsuranceCard;
