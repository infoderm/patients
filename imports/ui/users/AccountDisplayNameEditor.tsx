import React from 'react';

import InputOneSetting from '../settings/InputOneSetting';

import useUser from './useUser';

type Props = {
	readonly className?: string;
};

const AccountDisplayNameEditor = ({className}: Props) => {
	const user = useUser();
	return (
		<InputOneSetting
			className={className}
			setting="user-account-display-name"
			label="Display Name"
			placeholder={user?.username}
		/>
	);
};

export default AccountDisplayNameEditor;
