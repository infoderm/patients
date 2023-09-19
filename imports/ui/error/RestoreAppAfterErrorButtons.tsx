import React from 'react';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';

import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import HomeIcon from '@mui/icons-material/Home';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const Buttons = styled('div')({
	textAlign: 'center',
	paddingBottom: '2em',
});

const StyledButton = styled(Button)({
	margin: '1em',
});

type RestoreAppAfterErrorButtonsProps = {
	readonly retry: () => void;
};

const RestoreAppAfterErrorButtons = ({
	retry,
}: RestoreAppAfterErrorButtonsProps) => {
	const navigate = useNavigate();

	const reloadRoute = () => {
		navigate(0);
	};

	const goBackHome = () => {
		navigate('/');
		retry();
	};

	const reloadApp = () => {
		navigate('/');
		navigate(0);
	};

	return (
		<Buttons>
			<StyledButton
				variant="contained"
				color="primary"
				endIcon={<RotateRightIcon />}
				onClick={retry}
			>
				Re-render current route
			</StyledButton>
			<StyledButton
				variant="contained"
				color="secondary"
				endIcon={<RefreshIcon />}
				onClick={reloadRoute}
			>
				Reload current route
			</StyledButton>
			<br />
			<StyledButton
				variant="contained"
				color="primary"
				endIcon={<HomeIcon />}
				onClick={goBackHome}
			>
				Render home page
			</StyledButton>
			<StyledButton
				variant="contained"
				color="secondary"
				endIcon={<PowerSettingsNewIcon />}
				onClick={reloadApp}
			>
				Reload entire App
			</StyledButton>
		</Buttons>
	);
};

export default RestoreAppAfterErrorButtons;
