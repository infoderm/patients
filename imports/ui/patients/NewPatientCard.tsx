import React from 'react';
import {Link} from 'react-router-dom';

import GenericNewPatientCard from './GenericNewPatientCard';

const NewPatientCard = () => (
	<GenericNewPatientCard component={Link} to="/new/patient" />
);

export default NewPatientCard;
