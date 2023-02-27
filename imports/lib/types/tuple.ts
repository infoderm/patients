// See https://github.com/microsoft/TypeScript/issues/27179
// and https://github.com/microsoft/TypeScript/issues/16656

const tuple = <T extends any[]>(...elements: T) => elements;

export default tuple;
