export const myEncodeURIComponent = (component: string): string => {
	return encodeURIComponent(component);
};

export const myDecodeURIComponent = (component: string | undefined): string => {
	return component === undefined ? undefined : decodeURIComponent(component);
};
