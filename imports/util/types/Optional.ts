type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export default Optional;
