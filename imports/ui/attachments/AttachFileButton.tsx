import React, {ReactNode} from 'react';

import Button from '@mui/material/Button';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {useSnackbar, OptionsObject as NotistackOptionsObject} from 'notistack';

import PropsOf from '../../util/PropsOf';

import call from '../../api/endpoint/call';
import Endpoint from '../../api/endpoint/Endpoint';
import {MetadataType, Uploads} from '../../api/uploads';

import InputFileButton from '../input/InputFileButton';
import debounceSnackbar from '../../util/debounceSnackbar';

interface Props extends Omit<PropsOf<typeof InputFileButton>, 'onChange'> {
	endpoint: Endpoint<any>;
	item: string;
	children?: ReactNode;
}

const AttachFileButton = React.forwardRef(
	({endpoint, item: itemId, children, ...rest}: Props, ref) => {
		const {enqueueSnackbar, closeSnackbar} = useSnackbar();

		const upload = (event) => {
			const uploadFeedback = debounceSnackbar({enqueueSnackbar, closeSnackbar});
			const files = event.target.files;

			const totalCount = files.length;
			let uploadedCount = 0;
			let erroredCount = 0;
			const uploadingMessage = () =>
				`[Upload] Uploading ${
					totalCount - uploadedCount - erroredCount
				} file(s).`;
			uploadFeedback(uploadingMessage(), {variant: 'info'});
			const updateUploadingNotification = () => {
				const uploadingCount = totalCount - uploadedCount - erroredCount;
				if (uploadingCount === 0) {
					const messageDone = `[Upload] Done. (total: ${totalCount}, uploaded: ${uploadedCount}, failed: ${erroredCount})`;
					uploadFeedback(messageDone, {
						variant:
							erroredCount === 0
								? 'success'
								: erroredCount === totalCount
								? 'error'
								: 'warning',
						persist: true,
						action: (key) => (
							<Button
								color="inherit"
								onClick={() => {
									closeSnackbar(key);
								}}
							>
								Ok
							</Button>
						),
					});
				} else {
					uploadFeedback(uploadingMessage(), {variant: 'info'});
				}
			};

			const notistackInfoOptions: NotistackOptionsObject = {
				variant: 'info',
				persist: true,
			};

			const notistackErrorOptions: NotistackOptionsObject = {
				variant: 'error',
				persist: true,
				action: (key) => (
					<Button
						color="inherit"
						onClick={() => {
							closeSnackbar(key);
						}}
					>
						Dismiss
					</Button>
				),
			};

			const onEnd = async (err, fileObject, uploadFileFeedback) => {
				if (err) {
					++erroredCount;
					const message = `[Upload] Error during upload: ${err.message}`;
					console.error(message, err);
					uploadFileFeedback(message, notistackErrorOptions);
				} else {
					++uploadedCount;
					const message = `[Upload] File "${fileObject.name} (${fileObject._id})" successfully uploaded`;
					console.log(message);
					uploadFileFeedback(message, {variant: 'success'});
					const attachFeedback = debounceSnackbar({
						enqueueSnackbar,
						closeSnackbar,
					});
					attachFeedback(
						`[Attach] Attaching file "${fileObject.name} (${fileObject._id})" to item "${itemId}" using method "${endpoint.name}".`,
						notistackInfoOptions,
					);
					try {
						await call(endpoint, itemId, fileObject._id);
						const message = `[Attach] File "${fileObject.name} (${fileObject._id})" successfully attached to item "${itemId}" using method "${endpoint.name}".`;
						console.log(message);
						attachFeedback(message, {variant: 'success'});
					} catch (error: unknown) {
						const message =
							error instanceof Error ? error.message : 'unknown error';
						attachFeedback(message, notistackErrorOptions);
						console.error({error});
					}
				}

				updateUploadingNotification();
			};

			for (const file of files) {
				const meta: MetadataType = {};
				if (Number.isInteger(file.lastModified)) {
					meta.lastModified = new Date(file.lastModified);
				}

				const upload = Uploads.insert(
					{
						file,
						chunkSize: 'dynamic',
						meta,
					},
					false,
				);

				const message = '[Upload] init';
				console.log(message);
				const uploadFileFeedback = debounceSnackbar({
					enqueueSnackbar,
					closeSnackbar,
				});
				uploadFileFeedback(message, notistackInfoOptions);
				upload.on('start', () => {
					const message = '[Upload] started';
					console.log(message);
					uploadFileFeedback(message, notistackInfoOptions);
				});

				upload.on('end', async (err, fileObject) => {
					await onEnd(err, fileObject, uploadFileFeedback);
				});

				upload.start();
			}
		};

		const defaultText = 'Attach File';
		const computedChildren = children ?? defaultText;

		const extraProps =
			typeof computedChildren === 'string'
				? {endIcon: <AttachFileIcon />}
				: {'aria-label': defaultText};

		return (
			<InputFileButton ref={ref} onChange={upload} {...extraProps} {...rest}>
				{computedChildren}
			</InputFileButton>
		);
	},
);

export default AttachFileButton;
