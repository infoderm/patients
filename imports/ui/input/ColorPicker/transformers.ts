import {type ColorResult} from 'react-color';

export const DEFAULT_CONVERTER = 'rgba_hex';

type Converter = (c: ColorResult) => string;

export const converters: Record<string, Converter> = {
	rgba: (c) => `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`,
	rgb: (c) => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
	hex: (c) => c.hex,

	rgba_rgb: (c) => (c.rgb.a === 1 ? converters.rgb(c) : converters.rgba(c)),
	rgba_hex: (c) => (c.rgb.a === 1 ? converters.hex(c) : converters.rgba(c)),
};

export default converters;
