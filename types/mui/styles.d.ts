import {type Theme} from '@mui/material/styles';

declare module '@mui/material/styles' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Palette {
		red: Palette['primary'];
		green: Palette['primary'];
		blue: Palette['primary'];
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface PaletteOptions {
		red?: PaletteOptions['primary'];
		green?: PaletteOptions['primary'];
		blue?: PaletteOptions['primary'];
	}
}

declare module '@mui/material/Button' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface ButtonPropsColorOverrides {
		red: true;
		green: true;
		blue: true;
	}
}

declare module '@mui/material/Chip' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface ChipPropsColorOverrides {
		red: true;
		green: true;
		blue: true;
	}
}

declare module '@mui/styles/defaultTheme' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface DefaultTheme extends Theme {}
}
