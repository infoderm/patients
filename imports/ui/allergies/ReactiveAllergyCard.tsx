import React from 'react';

import useAllergy from './useAllergy';

import StaticAllergyCard from './StaticAllergyCard';

interface ReactiveAllergyCardProps {
	name: string;
}

const ReactiveAllergyCard = React.forwardRef<any, ReactiveAllergyCardProps>(
	({name}, ref) => {
		const {loading, item} = useAllergy(name, [name]);
		return <StaticAllergyCard ref={ref} loading={loading} item={item} />;
	}
);

export default ReactiveAllergyCard;
