import React from 'react';

import {useUnattachedUploads} from '../../api/issues';

import paged from '../routes/paged';

import makeAttachmentsPage from '../attachments/makeAttachmentsPage';

const UploadsPage = makeAttachmentsPage(useUnattachedUploads);
const UploadsPager = paged(UploadsPage);

type Props = React.JSX.IntrinsicAttributes &
	React.ClassAttributes<HTMLDivElement> &
	React.HTMLAttributes<HTMLDivElement>;

const UnattachedUploads = (props: Props) => {
	return (
		<div {...props}>
			<UploadsPager
				sort={{
					updatedAt: -1,
				}}
				LoadingIndicator={(_: {}) => <>Loading...</>}
				EmptyPage={({page}: {readonly page: number}) =>
					page === 1 ? (
						<>All uploads are attached to something :)</>
					) : (
						// eslint-disable-next-line react/jsx-no-useless-fragment
						<>{`Nothing to see on page ${page}.`}</>
					)
				}
			/>
		</div>
	);
};

export default UnattachedUploads;
