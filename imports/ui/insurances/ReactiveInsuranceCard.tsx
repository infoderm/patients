import React from 'react';

import useInsurance from './useInsurance';

import StaticInsuranceCard from './StaticInsuranceCard';

const ReactiveInsuranceCard = ({name}) => {
	const {loading, item} = useInsurance(name, [name]);
	return <StaticInsuranceCard loading={loading} item={item} />;
};

export default ReactiveInsuranceCard;
