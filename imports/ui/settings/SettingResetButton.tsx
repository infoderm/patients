import React, {useState} from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import CancelIcon from '@mui/icons-material/Cancel';

import {type SettingKey} from '../../api/settings';
import {useSetting} from './hooks';

type Props = {
	setting: SettingKey;
};

const SettingResetButton = ({setting}: Props) => {
	const {loading, resetValue} = useSetting(setting);
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
