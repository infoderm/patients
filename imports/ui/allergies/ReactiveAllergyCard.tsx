import React from 'react';

import useCachedAllergy from './useCachedAllergy';

import StaticAllergyCard from './StaticAllergyCard';

const ReactiveAllergyCard = ({item}) => {
	const init = {...item};
	const {name} = item;
	const query = {name};
	const options = {};
	const deps = [name];
	const {loading, found, fields} = useCachedAllergy(init, query, options, deps);
	return <StaticAllergyCard loading={loading} found={found} item={fields} />;
};

export default ReactiveAllergyCard;
