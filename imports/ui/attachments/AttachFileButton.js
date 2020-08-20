import {Meteor} from 'meteor/meteor';
import React from 'react';

import AttachFileIcon from '@material-ui/icons/AttachFile';

import InputFileButton from '../input/InputFileButton.js';

import {Uploads} from '../../api/uploads.js';

export default class AttachFileButton extends React.Component {
	upload = (event) => {
		const itemId = this.props.item;
		const method = this.props.method;
		const files = event.target.files;

		for (const file of files) {
			const upload = Uploads.insert(
				{
					file,
					streams: 'dynamic',
					chunkSize: 'dynamic',
					meta: {
						createdAt: new Date()
					}
				},
				false
			);

			upload.on('start', () => {
				console.log('[Upload] started');
			});

			upload.on('end', (err, fileObject) => {
				if (err) {
					console.error(`[Upload] Error during upload: ${err}`);
				} else {
					console.log(
						`[Upload] File "${fileObject.name} (${fileObject._id})" successfully uploaded`
					);
					Meteor.call(method, itemId, fileObject._id, (err, _res) => {
						if (err) {
							console.error(err);
						} else {
							console.log(
								`[Attach] File "${fileObject.name} (${fileObject._id})" successfully attached to item "${itemId}" using method "${method}".`
							);
						}
					});
				}
			});

			upload.start();
		}
	};

	render() {
		const {method, item, children, ...rest} = this.props;
		return (
			<InputFileButton onChange={this.upload} {...rest}>
				{children || (
					<>
						Attach File
						<AttachFileIcon />
					</>
				)}
			</InputFileButton>
		);
	}
}
