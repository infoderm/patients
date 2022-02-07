import React, {ComponentPropsWithoutRef} from 'react';

import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import AttachmentsGallery from './AttachmentsGallery';
import AttachmentInfo from './AttachmentInfo';

interface Props extends ComponentPropsWithoutRef<'div'> {
	patientId: string;
	attachmentsInfo: AttachmentInfo[];
	page?: number;
	perpage?: number;
}

const AttachmentsForPatientPage = ({
	patientId,
	attachmentsInfo,
	page = 1,
	perpage = 5,
	...rest
}: Props) => {
	const attachmentsInfoSlice = attachmentsInfo.slice(
		(page - 1) * perpage,
		page * perpage,
	);

	return (
		<>
			{attachmentsInfoSlice.length === 0 && (
				<NoContent>Nothing to see on page {page}.</NoContent>
			)}
			<div {...rest}>
				<AttachmentsGallery attachmentsInfo={attachmentsInfoSlice} />
			</div>
			<Paginator loading={false} end={attachmentsInfoSlice.length < perpage} />
		</>
	);
};

export default AttachmentsForPatientPage;
