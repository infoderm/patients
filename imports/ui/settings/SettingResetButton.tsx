import React, {useState} from 'react';

import type Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import CancelIcon from '@mui/icons-material/Cancel';

import type PropsOf from '../../util/types/PropsOf';

type Props = {
	readonly loading: boolean;
	readonly resetValue: () => Promise<void>;
} & PropsOf<typeof Button>;

const SettingResetButton = ({loading, resetValue, ...rest}: Props) => {
	const [resetting, setResetting] = useState(false);

	const onClick = async () => {
		setResetting(true);
		try {
			await resetValue();
		} catch (error: unknown) {
			console.error(error);
		} finally {
			setResetting(false);
		}
	};

	return (
		<LoadingButton
			{...rest}
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
