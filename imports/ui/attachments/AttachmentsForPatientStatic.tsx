import React, {ComponentPropsWithoutRef} from 'react';
import PropTypes, {InferProps} from 'prop-types';

import {makeStyles} from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import NoContent from '../navigation/NoContent';
import Paginator from '../navigation/Paginator';
import {computeFixedFabStyle} from '../button/FixedFab';

import AttachFileButton from './AttachFileButton';
import AttachmentsGallery from './AttachmentsGallery';

const useStyles = makeStyles((theme) => ({
	attachButton: computeFixedFabStyle({theme, col: 4}),
}));

const propTypes = {
	patientId: PropTypes.string.isRequired,
	attachmentsInfo: PropTypes.array.isRequired,
	page: PropTypes.number.isRequired,
	perpage: PropTypes.number.isRequired,
};

type Props = InferProps<typeof propTypes> & ComponentPropsWithoutRef<'div'>;

const AttachmentsForPatientStatic = ({
	patientId,
	attachmentsInfo,
	page,
	perpage,
	...rest
}: Props) => {
	const classes = useStyles();

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
			<AttachFileButton
				Button={Fab}
				className={classes.attachButton}
				color="default"
				method="/patients/attach"
				item={patientId}
			>
				<AttachFileIcon />
			</AttachFileButton>
			<Paginator
				page={page}
				end={attachmentsInfoSlice.length < perpage}
				root={`/patient/${patientId}/attachments`}
			/>
		</>
	);
};

AttachmentsForPatientStatic.propTypes = propTypes;

export default AttachmentsForPatientStatic;
