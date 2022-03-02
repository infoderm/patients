import React from 'react';

import {styled} from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const Root = styled('div')(({theme}) => ({
	display: 'flex',
	flex: 'auto',
	marginBottom: theme.spacing(1),
}));

const Title = styled(Typography)({
	minWidth: 100,
	flex: 'initial',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
});

interface CalendarHeaderProps {
	title?: string;
	actions?: React.ReactNode[];
}

const CalendarHeader = ({title, actions}: CalendarHeaderProps) => {
	return (
		<Root>
			{title && <Title variant="h6"> {title} </Title>}
			<Grid
				item
				xs
				container
				justifyContent="flex-end"
				spacing={1}
				sx={{flex: '1 1 auto'}}
			>
				{actions?.map((action, index) => (
					<Grid key={index} item>
						{action}
					</Grid>
				))}
			</Grid>
		</Root>
	);
};

export default CalendarHeader;
