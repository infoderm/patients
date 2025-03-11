import createUserWithPasswordAndLogin from './createUserWithPasswordAndLogin';
import logout from './logout';

const createUserWithPassword = async (
	username: string,
	password: string,
): Promise<string> => {
	const userId = await createUserWithPasswordAndLogin(username, password);
	await logout();
	return userId;
};

export default createUserWithPassword;
