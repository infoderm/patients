import React from 'react';

import {useCachedInsurance} from '../../api/insurances';
import {type TagNameFields} from '../../api/tags/TagDocument';

import StaticInsuranceCard from './StaticInsuranceCard';

type Props = {
	item: TagNameFields;
};

const ReactiveInsuranceCard = ({item}: Props) => {
	const init = {...item};
	const {name} = item;
	const query = {filter: {name}};
	const deps = [name];
	const {loading, found, fields} = useCachedInsurance(init, query, deps);
	return <StaticInsuranceCard loading={loading} found={found} item={fields} />;
};

export default ReactiveInsuranceCard;
