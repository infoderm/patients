export const myEncodeURIComponent = (component: string): string => {
	return encodeURIComponent(component);
};

export function myDecodeURIComponent<T extends string | undefined>(
	component: T,
): T;
export function myDecodeURIComponent(component: string | undefined) {
	return component === undefined ? undefined : decodeURIComponent(component);
}
