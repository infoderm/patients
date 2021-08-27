import React from 'react';
import PropTypes, {InferProps} from 'prop-types';

import Button from '@material-ui/core/Button';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {useSnackbar, OptionsObject as NotistackOptionsObject} from 'notistack';

import InputFileButton from '../input/InputFileButton';

import _call from '../../api/call';
import {Uploads} from '../../api/uploads';

const AttachFileButton = ({
	method,
	item: itemId,
	children,
	...rest
}: InferProps<typeof AttachFileButton.propTypes>) => {
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
					`[Attach] Attaching file "${fileObject.name} (${fileObject._id})" to item "${itemId}" using method "${method}".`,
					notistackInfoOptions,
				);
				try {
					await _call(method, itemId, fileObject._id);
					closeSnackbar(key2);
					const message = `[Attach] File "${fileObject.name} (${fileObject._id})" successfully attached to item "${itemId}" using method "${method}".`;
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
			const meta: {lastModified?: Date} = {};
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

			upload.on('end', (err, fileObject) => {
				closeSnackbar(keyUpload);
				onEnd(err, fileObject);
			});

			upload.start();
		}
	};

	const extraProps = children ? {} : {endIcon: <AttachFileIcon />};

	const buttonProps = {
		...extraProps,
		...rest,
	};

	return (
		<InputFileButton onChange={upload} {...buttonProps}>
			{children ?? 'Attach File'}
		</InputFileButton>
	);
};

AttachFileButton.propTypes = {
	method: PropTypes.string.isRequired,
	item: PropTypes.string.isRequired,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]),
};

export default AttachFileButton;
