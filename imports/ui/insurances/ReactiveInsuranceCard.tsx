import React from 'react';

import {useCachedInsurance} from '../../api/insurances';

import StaticInsuranceCard from './StaticInsuranceCard';

interface Props {
	item: {name: string};
}

const ReactiveInsuranceCard = ({item}: Props) => {
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
