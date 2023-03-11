import React from 'react';

import {useCachedAllergy} from '../../api/allergies';
import {type TagNameFields} from '../../api/tags/TagDocument';

import StaticAllergyCard from './StaticAllergyCard';

type Props = {
	item: TagNameFields;
};

const ReactiveAllergyCard = ({item}: Props) => {
	const init = {...item};
	const {name} = item;
	const query = {name};
	const options = {};
	const deps = [name];
	const {loading, found, fields} = useCachedAllergy(init, query, options, deps);
	// @ts-expect-error Too complex to fix.
	return <StaticAllergyCard loading={loading} found={found} item={fields} />;
};

export default ReactiveAllergyCard;
