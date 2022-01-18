import React from 'react';
import PropTypes from 'prop-types';

import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import DocumentCard from '../documents/DocumentCard';

export default function DocumentsForPatientStatic({
	patientId,
	documents,
	page,
	perpage,
	...rest
}) {
	console.debug(documents);
	return (
		<>
			{documents.length === 0 && (
				<NoContent>Nothing to see on page {page}.</NoContent>
			)}
			<div {...rest}>
				{documents.map((document, i) => (
					<DocumentCard
						key={document._id}
						document={document}
						PatientChip={null}
						defaultExpanded={page === 1 && i === 0}
					/>
				))}
			</div>
			<Paginator
				page={page}
				end={documents.length < perpage}
				root={`/patient/${patientId}/documents`}
			/>
		</>
	);
}

DocumentsForPatientStatic.propTypes = {
	documents: PropTypes.array.isRequired,
	page: PropTypes.number.isRequired,
};
