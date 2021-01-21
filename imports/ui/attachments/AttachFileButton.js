import {Meteor} from 'meteor/meteor';
import React from 'react';

import Button from '@material-ui/core/Button';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {useSnackbar} from 'notistack';

import InputFileButton from '../input/InputFileButton.js';

import {Uploads} from '../../api/uploads.js';

const AttachFileButton = ({method, item: itemId, children, ...rest}) => {
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
						<Button onClick={() => closeSnackbar(key)}>Ok</Button>
					)
				});
			} else {
				uploadingKey = enqueueSnackbar(uploadingMessage(), {variant: 'info'});
			}
		};

		const notistackInfoOptions = {
			variant: 'info',
			persist: true
		};

		const notistackErrorOptions = {
			variant: 'error',
			persist: true,
			action: (key) => (
				<Button onClick={() => closeSnackbar(key)}>Dismiss</Button>
			)
		};

		for (const file of files) {
			const upload = Uploads.insert(
				{
					file,
					streams: 'dynamic',
					chunkSize: 'dynamic',
					meta: {}
				},
				false
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
						`[Attach] Attaching file "${fileObject.name} (${fileObject._id})" to item "${itemId}" using method "${method}`,
						notistackInfoOptions
					);
					Meteor.call(method, itemId, fileObject._id, (err, _res) => {
						closeSnackbar(key2);
						if (err) {
							console.error(err);
							enqueueSnackbar(err.message, notistackErrorOptions);
						} else {
							const message = `[Attach] File "${fileObject.name} (${fileObject._id})" successfully attached to item "${itemId}" using method "${method}".`;
							console.log(message);
							enqueueSnackbar(message, {variant: 'success'});
						}
					});
				}

				updateUploadingNotification();
			});

			upload.start();
		}
	};

	return (
		<InputFileButton onChange={upload} {...rest}>
			{children || (
				<>
					Attach File
					<AttachFileIcon />
				</>
			)}
		</InputFileButton>
	);
};

export default AttachFileButton;
