import React, {ReactNode} from 'react';

import Button from '@material-ui/core/Button';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {useSnackbar, OptionsObject as NotistackOptionsObject} from 'notistack';

import PropsOf from '../../util/PropsOf';

import call from '../../api/endpoint/call';
import Endpoint from '../../api/endpoint/Endpoint';
import {MetadataType, Uploads} from '../../api/uploads';

import InputFileButton from '../input/InputFileButton';

interface Props extends Omit<PropsOf<typeof InputFileButton>, 'onChange'> {
	endpoint: Endpoint<unknown>;
	item: string;
	children?: ReactNode;
}

const AttachFileButton = ({
	endpoint,
	item: itemId,
	children,
	...rest
}: Props) => {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	const upload = (event) => {
		const files = event.target.files;

		const totalCount = files.length;
		let uploadedCount = 0;
		let erroredCount = 0;
		const uploadingMessage = () =>
			`[Upload] Uploading ${
				totalCount - uploadedCount - erroredCount
			} file(s).`;
		let uploadingKey = enqueueSnackbar(uploadingMessage(), {variant: 'info'});
		const updateUploadingNotification = () => {
			closeSnackbar(uploadingKey);
			const uploadingCount = totalCount - uploadedCount - erroredCount;
			if (uploadingCount === 0) {
				const messageDone = `[Upload] Done. (total: ${totalCount}, uploaded: ${uploadedCount}, failed: ${erroredCount})`;
				uploadingKey = enqueueSnackbar(messageDone, {
					variant:
						erroredCount === 0
							? 'success'
							: erroredCount === totalCount
							? 'error'
							: 'warning',
					persist: true,
					action: (key) => (
						<Button
							onClick={() => {
								closeSnackbar(key);
							}}
						>
							Ok
						</Button>
					),
				});
			} else {
				uploadingKey = enqueueSnackbar(uploadingMessage(), {variant: 'info'});
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
					onClick={() => {
						closeSnackbar(key);
					}}
				>
					Dismiss
				</Button>
			),
		};

		const onEnd = async (err, fileObject) => {
			if (err) {
				++erroredCount;
				const message = `[Upload] Error during upload: ${err.message}`;
				console.error(message, err);
				enqueueSnackbar(message, notistackErrorOptions);
			} else {
				++uploadedCount;
				const message = `[Upload] File "${fileObject.name} (${fileObject._id})" successfully uploaded`;
				console.log(message);
				enqueueSnackbar(message, {variant: 'info'});
				const key2 = enqueueSnackbar(
					`[Attach] Attaching file "${fileObject.name} (${fileObject._id})" to item "${itemId}" using method "${endpoint.name}".`,
					notistackInfoOptions,
				);
				try {
					await call(endpoint, itemId, fileObject._id);
					closeSnackbar(key2);
					const message = `[Attach] File "${fileObject.name} (${fileObject._id})" successfully attached to item "${itemId}" using method "${endpoint.name}".`;
					console.log(message);
					enqueueSnackbar(message, {variant: 'success'});
				} catch (error: unknown) {
					closeSnackbar(key2);
					const message =
						error instanceof Error ? error.message : 'unknown error';
					enqueueSnackbar(message, notistackErrorOptions);
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
			let keyUpload = enqueueSnackbar(message, notistackInfoOptions);

			upload.on('start', () => {
				const message = '[Upload] started';
				console.log(message);
				closeSnackbar(keyUpload);
				keyUpload = enqueueSnackbar(message, notistackInfoOptions);
			});

			upload.on('end', async (err, fileObject) => {
				closeSnackbar(keyUpload);
				await onEnd(err, fileObject);
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
		<InputFileButton onChange={upload} {...extraProps} {...rest}>
			{computedChildren}
		</InputFileButton>
	);
};

export default AttachFileButton;
