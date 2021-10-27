import React from 'react';

import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';
import {PermissionTokenDocument} from '../../api/collection/permissionTokens';

import PermissionTokenAccordion from './PermissionTokenAccordion';
import PermissionTokenGenerationButton from './PermissionTokenGenerationButton';
import usePermissionTokens from './usePermissionTokens';

interface Props {
	className?: string;
}

const styles = (theme) => ({
	list: {
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(2),
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
});

const useStyles = makeStyles(styles);

const PermissionTokens = ({className}: Props) => {
	const classes = useStyles();
	const {results} = usePermissionTokens({}, {}, []);
	return (
		<div className={className}>
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
		</div>
	);
};

export default PermissionTokens;
