import type React from 'react';

type PropsOf<C> = C extends
	| React.ComponentType<infer P>
	| React.Component<infer P>
	? JSX.LibraryManagedAttributes<C, P>
	: never;

export default PropsOf;
