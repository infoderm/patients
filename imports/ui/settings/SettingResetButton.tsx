import React, {useState} from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import CancelIcon from '@mui/icons-material/Cancel';

type Props = {
	readonly loading: boolean;
	readonly resetValue: () => Promise<void>;
};

const SettingResetButton = ({loading, resetValue}: Props) => {
	const [resetting, setResetting] = useState(false);

	const onClick = async () => {
		setResetting(true);
		try {
			await resetValue();
		} catch (error: unknown) {
			console.error(error);
		}

		setResetting(false);
	};

	return (
		<LoadingButton
			disabled={loading}
			color="secondary"
			loading={resetting}
			loadingPosition="end"
			endIcon={<CancelIcon />}
			onClick={onClick}
		>
			Reset
		</LoadingButton>
	);
};

export default SettingResetButton;
