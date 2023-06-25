import React from 'react';

import PlannerContext from './PlannerContext';
import usePlannerState from './usePlannerState';

const PlannerProvider = ({children}) => {
	const state = usePlannerState();
	return (
		<PlannerContext.Provider value={state}>{children}</PlannerContext.Provider>
	);
};

export default PlannerProvider;
