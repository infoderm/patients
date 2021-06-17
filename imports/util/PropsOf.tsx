type PropsOf<T> = T extends React.ComponentType<infer Props> ? Props : never;

export default PropsOf;
