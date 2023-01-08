import {type Theme} from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface DefaultTheme extends Theme {}
}
