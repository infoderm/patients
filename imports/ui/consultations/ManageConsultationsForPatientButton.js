import React from 'react';

import {Link} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';

const ManageConsultationsForPatientButton = ({patientId, ...rest}) => {
	return (
		<Fab {...rest} component={Link} to={`/new/consultation/for/${patientId}`} />
	);
};

export default ManageConsultationsForPatientButton;
