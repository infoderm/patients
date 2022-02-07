import React, {useState} from 'react';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import call from '../../api/endpoint/call';
import revoke from '../../api/endpoint/permissions/token/revoke';
import {PermissionTokenDocument} from '../../api/collection/permissionTokens';
import useIsMounted from '../hooks/useIsMounted';

interface Props {
	item: PermissionTokenDocument;
}

const PermissionTokenRevocationButton = ({item}: Props) => {
	const [revoking, setRevoking] = useState(false);

	const isMounted = useIsMounted();

	const onClick = async () => {
		setRevoking(true);
		try {
			await call(revoke, item._id);
			if (isMounted()) setRevoking(false);
		} catch (error: unknown) {
			console.debug({error});
			setRevoking(false);
		}
	};

	return (
		<Button
			color="secondary"
			disabled={revoking}
			endIcon={<DeleteIcon />}
			onClick={onClick}
		>
			Revoke
		</Button>
	);
};

export default PermissionTokenRevocationButton;
