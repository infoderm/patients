import {type Theme} from '@mui/material';
import {type AnyColor, type Colord, colord, extend} from 'colord';
import mixPlugin from 'colord/plugins/mix';

export {emphasize} from '@mui/material/styles';

extend([mixPlugin]);

export type Color = Colord & {__brand: 'VALID_COLORD_OBJECT'};

export const blend = (a: Color, b: Color) => {
	const ratio = (1 + b.alpha() - a.alpha()) / 2;
	return a.mix(b, ratio).alpha(a.alpha());
};

export const textColor = (_theme: Theme, backgroundColor: Color) =>
	color(backgroundColor.isLight() ? '#111' : '#ddd');
export const hoverColor = (theme: Theme, c: Color) =>
	blend(c, color(theme.palette.action.hover));
export const focusColor = (theme: Theme, c: Color) =>
	blend(c, color(theme.palette.action.focus));
export const selectedColor = (theme: Theme, c: Color) =>
	blend(c, color(theme.palette.action.selected));
export const disabledColor = (theme: Theme, c: Color) =>
	blend(c, color(theme.palette.action.disabled));

const color = (input: AnyColor) => {
	const c = colord(input);
	if (!c.isValid()) {
		throw new Error(`Invalid input ${JSON.stringify(input)} given to colord.`);
	}

	return c as Color;
};

export default color;
