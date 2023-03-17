import React from 'react';

import {styled} from '@mui/material/styles';

import Typography from '@mui/material/Typography';

import {type PermissionTokenDocument} from '../../api/collection/permissionTokens';

import PermissionTokenAccordion from './PermissionTokenAccordion';
import PermissionTokenGenerationButton from './PermissionTokenGenerationButton';
import usePermissionTokens from './usePermissionTokens';

const PREFIX = 'PermissionTokens';

const classes = {
	list: `${PREFIX}-list`,
};

const Root = styled('div')(({theme}) => ({
	[`& .${classes.list}`]: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(2),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
}));

type Props = {
	className?: string;
};

const PermissionTokens = ({className}: Props) => {
	const {results} = usePermissionTokens({filter: {}}, []);
	return (
		<Root className={className}>
			<Typography variant="h4">
				Permission Tokens <PermissionTokenGenerationButton />
			</Typography>
			<div className={classes.list}>
				{results.map((permissionToken: PermissionTokenDocument) => (
					<PermissionTokenAccordion
						key={permissionToken._id}
						item={permissionToken}
					/>
				))}
			</div>
		</Root>
	);
};

export default PermissionTokens;
