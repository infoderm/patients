import React, {type ComponentPropsWithoutRef} from 'react';

import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';

import AttachmentsGallery from './AttachmentsGallery';
import type AttachmentInfo from './AttachmentInfo';

type Props = {
	readonly patientId: string;
	readonly attachmentsInfo: AttachmentInfo[];
	readonly page?: number;
	readonly perpage?: number;
} & ComponentPropsWithoutRef<'div'>;

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
