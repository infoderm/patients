declare let Factory: Global;

declare class Instance {
	name: Name;
	collection: MeteorCollection;
	attributes: Attributes;
	afterHooks: Callback[];
	sequence: number;

	constructor(name: Name, collection: MeteorCollection, attributes: Attributes);
	after(fn: Callback): this;
}

type MeteorCollection = any;
type Name = string;
type Attributes = object;
type UserOptions = object;
type Options = object;
type Item = {[x: string]: any; _id: string};
type Callback = (x: Item) => void;

interface Global {
	define: (
		name: Name,
		collection: MeteorCollection,
		attributes: Attributes
	) => Instance;
	get: (name: Name) => Instance;
	_build: (
		name: Name,
		attributes?: Attributes,
		userOptions?: UserOptions,
		options?: Options
	) => Item;
	build: (
		name: Name,
		attributes?: Attributes,
		userOptions?: UserOptions
	) => Item;
	tree: (
		name: Name,
		attributes?: Attributes,
		userOptions?: UserOptions
	) => Item;
	_create: (name: Name, doc: Item) => Item;
	create: (
		name: Name,
		attributes?: Attributes,
		userOptions?: UserOptions
	) => Item;
	extend: (name: Name, attributes?: Attributes) => Attributes;
}
