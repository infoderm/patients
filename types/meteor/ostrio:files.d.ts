declare module 'meteor/ostrio:files' {
	import type {Buffer} from 'node:buffer';
	import type * as http from 'node:http';

	import {EventEmitter} from 'eventemitter3';
	import type {Meteor} from 'meteor/meteor';
	import type {Mongo} from 'meteor/mongo';
	import type {
		CountDocumentsOptions,
		EstimatedDocumentCountOptions,
	} from 'mongodb';
	import type {ReactiveVar} from 'meteor/reactive-var';
	import type SimpleSchema from 'simpl-schema';
	import type {IncomingMessage} from 'connect';
	import type {DDP} from 'meteor/ddp';

	export type ParamsHTTP = {
		_id: string;
		query: Record<string, string>;
		name: string;
		version: string;
	};

	export type ContextHTTP = {
		request: IncomingMessage;
		response: http.ServerResponse;
		params: ParamsHTTP;
	};

	export type ContextUser = {
		userId: string;
		user: () => Meteor.User;
	};

	export type ContextUpload = {
		file: object;
		/** On server only. */
		chunkId?: number;
		/** On server only. */
		eof?: boolean;
	};

	export type MeteorFilesTransportType = 'http' | 'ddp';
	export type MeteorFilesSelector<S> =
		| Mongo.Selector<S>
		| Mongo.ObjectID
		| string;
	export type MeteorFilesOptions<O> = Mongo.Options<O>;
	export type FileHandleCache<MetadataType> = Map<
		string,
		WriteStream<MetadataType>
	>;

	export type Version<MetadataType> = {
		extension: string;
		meta: MetadataType;
		path: string;
		size: number;
		type: string;
	};

	export type FileObj<MetadataType> = {
		_id: string;
		size: number;
		name: string;
		type: string;
		path: string;
		isVideo: boolean;
		isAudio: boolean;
		isImage: boolean;
		isText: boolean;
		isJSON: boolean;
		isPDF: boolean;
		ext?: string;
		extension?: string;
		chunkSize?: number;
		extensionWithDot: string;
		_storagePath: string;
		_downloadRoute: string;
		_collectionName: string;
		public?: boolean;
		meta?: MetadataType;
		userId?: string;
		updatedAt?: Date;
		versions: Record<string, Version<MetadataType>>;
		mime: string;
		'mime-type': string;
	};

	export type FileData<MetadataType> = {
		size: number;
		type: string;
		mime: string;
		'mime-type': string;
		ext: string;
		extension: string;
		name: string;
		meta: MetadataType;
	};

	/**
	 * A writable stream wrapper that ensures chunks are written in the correct order.
	 */
	export class WriteStream<MetadataType> {
		/**
		 * Creates a new WriteStream instance.
		 * @param path - The file system path where the file will be written.
		 * @param maxLength - The maximum number of chunks expected.
		 * @param file - An object containing file properties such as `size` and `chunkSize`.
		 * @param permissions - The file permissions (octal string) to use when opening the file (e.g., '611' or '0o777').
		 */
		constructor(
			path: string,
			maxLength: number,
			file: FileObj<MetadataType>,
			permissions: string,
		);

		/**
		 * Initializes the WriteStream by ensuring the directory exists, creating the file,
		 * preallocating the file size, and caching the file handle.
		 * @returns A promise that resolves with this WriteStream instance.
		 */
		init(): Promise<this>;

		/**
		 * Writes a chunk to the file at the specified chunk position.
		 * @param num - The 1-indexed position of the chunk.
		 * @param chunk - The buffer containing the chunk data.
		 * @returns A promise that resolves to true if the chunk was successfully written, or false if not.
		 */
		write(num: number, chunk: Buffer): Promise<boolean>;

		/**
		 * Waits for all chunks to be written, polling for completion up to a timeout.
		 * @returns A promise that resolves to true if the file was fully written, or false if writing was aborted.
		 */
		waitForCompletion(): Promise<boolean>;

		/**
		 * Finishes writing to the stream after ensuring that all chunks are written.
		 * @returns A promise that resolves to true if the stream is fully written, or false if it is still in progress.
		 */
		end(): Promise<boolean>;

		/**
		 * Aborts the writing process and removes the created file.
		 * @returns A promise that resolves to true once the abort process is complete.
		 */
		abort(): Promise<boolean>;

		/**
		 * Stops the writing process.
		 * @param isAborted - Indicates whether the stop is due to an abort.
		 * @returns A promise that resolves to true once the stream is stopped.
		 */
		stop(isAborted?: boolean): Promise<boolean>;
	}

	/**
	 * Core class for FilesCollection. Most other classes extend and build on this one.
	 */
	export class FilesCollectionCore<MetadataType> extends EventEmitter {
		/** Helper functions available as a static property */
		static __helpers: unknown;

		/** Default schema definition */
		static schema: {
			_id: {type: string};
			size: {type: number};
			name: {type: string};
			type: {type: string};
			path: {type: string};
			isVideo: {type: boolean};
			isAudio: {type: boolean};
			isImage: {type: boolean};
			isText: {type: boolean};
			isJSON: {type: boolean};
			isPDF: {type: boolean};
			extension: {type: string; optional: true};
			ext: {type: string; optional: true};
			extensionWithDot: {type: string; optional: true};
			mime: {type: string; optional: true};
			'mime-type': {type: string; optional: true};
			_storagePath: {type: string};
			_downloadRoute: {type: string};
			_collectionName: {type: string};
			public: {type: boolean; optional: true};
			meta: {type: Object; blackbox: true; optional: true};
			userId: {type: string; optional: true};
			updatedAt: {type: Date; optional: true};
			versions: {type: Object; blackbox: true};
		};

		// Instance properties that are used in the class:
		collection: Mongo.Collection<FileObj<MetadataType>>;
		debug?: boolean;
		downloadRoute?: string;
		collectionName?: string;
		storagePath: (data: Partial<FileObj<MetadataType>>) => string;

		constructor();

		/**
		 * Print logs in debug mode.
		 * @param args - Arguments to log.
		 * @returns {void}
		 */
		_debug(...args: unknown[]): void;

		/**
		 * Get file name from file data.
		 * @param fileData - File data object.
		 * @returns {string} The sanitized file name.
		 */
		_getFileName(fileData: FileData<MetadataType>): string;

		/**
		 * Get extension information from a file name.
		 * @param fileName - The file name.
		 * @returns {Partial<FileData>} An object with ext, extension and extensionWithDot.
		 */
		_getExt(fileName: string): Partial<FileData<MetadataType>>;

		/**
		 * Update file type booleans based on the file's MIME type.
		 * @param data - File data object.
		 * @returns {void}
		 */
		_updateFileTypes(data: FileData<MetadataType>): void;

		/**
		 * Convert raw file data to an object that conforms to the default schema.
		 * @param data - File data combined with partial FileObj properties.
		 * @returns {Partial<FileObj>} The schema-compliant file object.
		 */
		_dataToSchema(
			data: FileData<MetadataType> & Partial<FileObj<MetadataType>>,
		): Partial<FileObj<MetadataType>>;

		/**
		 * Find and return a FileCursor for a matching document asynchronously.
		 * @param selector - Mongo-style selector.
		 * @param options - Mongo query options.
		 * @returns {Promise<FileCursor | null>} The FileCursor instance or null if not found.
		 */
		findOneAsync<S, O>(
			selector?: MeteorFilesSelector<S>,
			options?: MeteorFilesOptions<O>,
		): Promise<FileCursor<MetadataType> | null>;

		/**
		 * Find and return a FileCursor for a matching document (client only).
		 * @param selector - Mongo-style selector.
		 * @param options - Mongo query options.
		 * @returns {FileCursor | null} The FileCursor instance or null if not found.
		 * @throws {Meteor.Error} If called on the server.
		 */
		findOne<S, O>(
			selector?: MeteorFilesSelector<S>,
			options?: MeteorFilesOptions<O>,
		): FileCursor<MetadataType> | null;

		/**
		 * Find and return a FilesCursor for matching documents.
		 * @param selector - Mongo-style selector.
		 * @param options - Mongo query options.
		 * @returns {FilesCursor} The FilesCursor instance.
		 */
		find<S, O>(
			selector?: MeteorFilesSelector<S>,
			options?: MeteorFilesOptions<O>,
		): FilesCursor<MetadataType, S, O>;

		/**
		 * Update documents in the underlying collection.
		 * @param args - Arguments to pass to Mongo.Collection.update.
		 * @returns {Mongo.Collection<FileObj<MetadataType>>} The collection instance.
		 */
		update(...args: unknown[]): Mongo.Collection<FileObj<MetadataType>>;

		/**
		 * Asynchronously update documents in the underlying collection.
		 * @param args - Arguments to pass to Mongo.Collection.updateAsync.
		 * @returns {Promise<number>} The number of updated records.
		 */
		updateAsync(...args: unknown[]): Promise<number>;

		/**
		 * Count records matching a selector.
		 * @param selector - Mongo-style selector.
		 * @param options - Mongo's CountDocumentsOptions.
		 * @returns {Promise<number>} The number of matching records.
		 */
		countDocuments<S>(
			selector?: MeteorFilesSelector<S>,
			options?: CountDocumentsOptions,
		): Promise<number>;

		/**
		 * Count all documents in the collection.
		 * @param options - Mongo's EstimatedDocumentCountOptions.
		 * @returns {Promise<number>} The number of matching records.
		 */
		estimatedDocumentCount(
			options?: EstimatedDocumentCountOptions,
		): Promise<number>;

		/**
		 * Return a downloadable URL for the given file.
		 * @param fileRef - Partial file object reference.
		 * @param version - File version (default is 'original').
		 * @param uriBase - Optional URI base.
		 * @returns {string} The download URL, or an empty string if the file is invalid.
		 */
		link(
			fileRef: Partial<FileObj<MetadataType>>,
			version?: string,
			uriBase?: string,
		): string;
	}

	export type FilesCollectionConfig<MetadataType> = {
		storagePath?: string | ((fileObj: FileObj<MetadataType>) => string);
		collection?: Mongo.Collection<FileObj<MetadataType>>;
		collectionName?: string;
		continueUploadTTL?: string;
		ddp?: DDP.DDPStatic;
		cacheControl?: string;
		responseHeaders?:
			| Record<string, string>
			| ((
					responseCode?: string,
					fileObj?: FileObj<MetadataType>,
					versionRef?: Version<MetadataType>,
					version?: string,
			  ) => Record<string, string>);
		throttle?: number | boolean;
		downloadRoute?: string;
		schema?: SimpleSchema | Record<string, unknown>;
		chunkSize?: number | 'dynamic';
		namingFunction?: (fileObj: FileObj<MetadataType>) => string;
		permissions?: number;
		parentDirPermissions?: number;
		integrityCheck?: boolean;
		strict?: boolean;
		downloadCallback?: (
			this: ContextHTTP & ContextUser,
			fileObj: FileObj<MetadataType>,
		) => boolean;
		protected?:
			| boolean
			| ((
					this: ContextHTTP & ContextUser,
					fileObj: FileObj<MetadataType>,
			  ) => boolean | number);
		public?: boolean;
		onBeforeUpload?: (
			this: ContextUpload & ContextUser,
			fileData: FileData<MetadataType>,
		) => boolean | string;
		onBeforeRemove?: (
			this: ContextUser,
			cursor: Mongo.Cursor<FileObj<MetadataType>>,
		) => Promise<boolean>;
		onInitiateUpload?: (
			this: ContextUpload & ContextUser,
			fileData: FileData<MetadataType>,
		) => void;
		onAfterUpload?: (fileObj: FileObj<MetadataType>) => void;
		onAfterRemove?: (files: ReadonlyArray<FileObj<MetadataType>>) => void;
		onbeforeunloadMessage?: string | (() => string);
		allowClientCode?: boolean;
		debug?: boolean;
		interceptDownload?: (
			http: ContextHTTP,
			fileObj: FileObj<MetadataType>,
			version: string,
		) => boolean;
	};

	export type InsertOptions<MetadataType> = {
		file: File | String;
		fileId?: string;
		fileName?: string;
		isBase64?: boolean;
		meta?: MetadataType;
		transport?: MeteorFilesTransportType;
		ddp?: DDP.DDPStatic;
		onStart?: (error: Meteor.Error, fileData: FileData<MetadataType>) => void;
		onUploaded?: (error: Meteor.Error, fileObj: FileObj<MetadataType>) => void;
		onAbort?: (fileData: FileData<MetadataType>) => void;
		onError?: (error: Meteor.Error, fileData: FileData<MetadataType>) => void;
		onProgress?: (progress: number, fileData: FileData<MetadataType>) => void;
		onBeforeUpload?: (fileData: FileData<MetadataType>) => boolean;
		chunkSize?: number | 'dynamic';
		allowWebWorkers?: boolean;
		type?: string;
	};

	export type FileUploadConfig<MetadataType> = {
		_debug: (...args: unknown[]) => void;
		file: File;
		fileData: FileData<MetadataType>;
		isBase64?: boolean;
		onAbort?: (
			this: FileUpload<MetadataType>,
			file: FileData<MetadataType> & Partial<File>,
		) => void;
		beforeunload?: (e: BeforeUnloadEvent | Event) => string;
		_onEnd?: () => void;
		fileId?: string;
		debug?: boolean;
		ddp?: DDP.DDPStatic;
		chunkSize?: number | 'dynamic';
	};

	/**
	 * FileUpload – an internal class returned by the .insert() method.
	 */
	export class FileUpload<MetadataType> extends EventEmitter {
		config: FileUploadConfig<MetadataType>;
		file: FileData<MetadataType> & Partial<File>;
		state: ReactiveVar<string>;
		onPause: ReactiveVar<boolean>;
		progress: ReactiveVar<number>;
		continueFunc: () => void;
		estimateTime: ReactiveVar<number>;
		estimateSpeed: ReactiveVar<number>;
		estimateTimer: number;
		constructor(config: FileUploadConfig<MetadataType>);
		pause(): void;
		continue(): void;
		toggle(): void;
		abort(): void;
	}

	export type UploadInstanceConfig<MetadataType> = {
		ddp?: DDP.DDPStatic;
		file: File;
		fileId?: string;
		meta?: MetadataType;
		type?: string;
		onError?: (
			this: FileUpload<MetadataType>,
			error: Meteor.Error,
			fileData: FileData<MetadataType>,
		) => void;
		onAbort?: (
			this: FileUpload<MetadataType>,
			file: FileData<MetadataType>,
		) => void;
		onStart?: (
			this: FileUpload<MetadataType>,
			error: Meteor.Error | null,
			fileData: FileData<MetadataType>,
		) => void;
		fileName?: string;
		isBase64?: boolean;
		transport: MeteorFilesTransportType;
		chunkSize: number | 'dynamic';
		onUploaded?: (
			this: FileUpload<MetadataType>,
			error: Meteor.Error | null,
			data: FileObj<MetadataType>,
		) => void;
		onProgress?: (
			this: FileUpload<MetadataType>,
			progress: number,
			fileData: FileData<MetadataType>,
			info?: {chunksSent: number; chunksLength: number; bytesSent: number},
		) => void;
		onBeforeUpload?: (
			this: FileUpload<MetadataType>,
			fileData: FileData<MetadataType>,
		) => boolean | string | Promise<boolean | string>;
		allowWebWorkers: boolean;
		disableUpload?: boolean;
		_debug?: (...args: unknown[]) => void;
		debug?: boolean;
	};

	/**
	 * UploadInstance – internal class used for handling file uploads.
	 */
	export class UploadInstance<MetadataType> extends EventEmitter {
		config: UploadInstanceConfig<MetadataType>;
		collection: FilesCollection<MetadataType>;
		worker: Worker | null | false;
		fetchControllers: Record<string, AbortController>;
		transferTime: number;
		trackerComp: Tracker.Computation | null;
		sentChunks: number;
		fileLength: number;
		startTime: Record<number, number>;
		EOFsent: boolean;
		fileId: string;
		FSName: string;
		pipes: Array<(data: string) => string>;
		fileData: FileData<MetadataType>;
		result: FileUpload<MetadataType>;
		beforeunload: (e: BeforeUnloadEvent | Event) => string;
		_setProgress: (progress: number) => void;
		constructor(
			config: UploadInstanceConfig<MetadataType>,
			collection: FilesCollection<MetadataType>,
		);
		error(error: Meteor.Error, data?: unknown): this;
		end(error?: Meteor.Error, data?: unknown): FileUpload<MetadataType>;
		sendChunk(evt: {data: {bin: string; chunkId: number}}): void;
		sendEOF(): void;
		proceedChunk(chunkId: number): void;
		upload(): this;
		prepare(): void;
		pipe(func: (data: string) => string): this;
		start(): Promise<FileUpload<MetadataType>> | FileUpload<MetadataType>;
		manual(): FileUpload<MetadataType>;
	}

	/**
	 * FileCursor – internal class representing a single file document.
	 * Instances are returned from methods such as `.findOne()` or via iteration over a FilesCursor.
	 */
	export class FileCursor<MetadataType> {
		_fileRef: FileObj<MetadataType>;
		_collection: FilesCollection<MetadataType>;
		constructor(
			_fileRef: FileObj<MetadataType>,
			_collection: FilesCollection<MetadataType>,
		);
		remove(): FileCursor<MetadataType>;
		removeAsync(): Promise<FileCursor<MetadataType>>;
		link(version?: string, uriBase?: string): string;
		get(property?: string): unknown;
		fetch(): Array<FileObj<MetadataType>>;
		fetchAsync(): Promise<Array<FileObj<MetadataType>>>;
		with(): FileCursor<MetadataType>;
	}

	/**
	 * FilesCursor – internal class representing a cursor over file documents.
	 */
	export class FilesCursor<MetadataType, S, O> {
		_collection: FilesCollection<MetadataType>;
		_selector: MeteorFilesSelector<S>;
		_current: number;
		cursor: Mongo.Cursor<FileObj<MetadataType>>;
		constructor(
			_selector: MeteorFilesSelector<S>,
			options: MeteorFilesOptions<O>,
			_collection: FilesCollection<MetadataType>,
		);
		get(): Array<FileObj<MetadataType>>;
		getAsync(): Promise<Array<FileObj<MetadataType>>>;
		hasNext(): boolean;
		hasNextAsync(): Promise<boolean>;
		next(): FileObj<MetadataType> | undefined;
		nextAsync(): Promise<FileObj<MetadataType> | undefined>;
		hasPrevious(): boolean;
		hasPreviousAsync(): Promise<boolean>;
		previous(): FileObj<MetadataType> | undefined;
		previousAsync(): Promise<FileObj<MetadataType> | undefined>;
		fetch(): Array<FileObj<MetadataType>>;
		fetchAsync(): Promise<Array<FileObj<MetadataType>>>;
		first(): FileObj<MetadataType> | undefined;
		firstAsync(): Promise<FileObj<MetadataType> | undefined>;
		last(): FileObj<MetadataType> | undefined;
		lastAsync(): Promise<FileObj<MetadataType> | undefined>;
		count(): number;
		countAsync(): Promise<number>;
		remove(callback?: Function): FilesCursor<MetadataType, S, O>;
		removeAsync(): Promise<number>;
		forEach(
			callback: Function,
			context?: object,
		): FilesCursor<MetadataType, S, O>;
		forEachAsync(
			callback: Function,
			context?: object,
		): Promise<FilesCursor<MetadataType, S, O>>;
		each(): Array<FileCursor<MetadataType>>;
		eachAsync(): Promise<Array<FileCursor<MetadataType>>>;
		map(callback: Function, context?: object): Array<FileObj<MetadataType>>;
		mapAsync(
			callback: Function,
			context?: object,
		): Promise<Array<FileObj<MetadataType>>>;
		current(): FileObj<MetadataType> | undefined;
		currentAsync(): Promise<FileObj<MetadataType> | undefined>;
		observe(
			callbacks: Mongo.ObserveCallbacks<FileObj<MetadataType>>,
		): Meteor.LiveQueryHandle;
		observeAsync(
			callbacks: Mongo.ObserveCallbacks<FileObj<MetadataType>>,
		): Promise<Meteor.LiveQueryHandle>;
		observeChanges(
			callbacks: Mongo.ObserveChangesCallbacks<FileObj<MetadataType>>,
		): Meteor.LiveQueryHandle;
		observeChangesAsync(
			callbacks: Mongo.ObserveChangesCallbacks<FileObj<MetadataType>>,
		): Promise<Meteor.LiveQueryHandle>;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
	export class FilesCollection<
		MetadataType,
	> extends FilesCollectionCore<MetadataType> {
		constructor(config: FilesCollectionConfig<MetadataType>);
	}

	// --------------------------------------------------------------------------
	// Client/Browser-specific overloads for FilesCollection
	// --------------------------------------------------------------------------
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	export interface FilesCollection<MetadataType> {
		/**
		 * Inserts a file into the collection and returns an instance of FileUpload/UploadInstance.
		 * @param config - The insert options.
		 * @param autoStart - Whether to start the upload immediately.
		 */
		insert(
			config: InsertOptions<MetadataType>,
			autoStart?: true,
		): UploadInstance<MetadataType>;
		insert(
			config: InsertOptions<MetadataType>,
			autoStart: false,
		): FileUpload<MetadataType> &
			Pick<UploadInstance<MetadataType>, 'start' | 'pipe'>;

		/**
		 * Asynchronously inserts a file into the collection.
		 * @param config - The insert options.
		 * @param autoStart - Whether to start the upload immediately.
		 */
		insertAsync(
			config: InsertOptions<MetadataType>,
			autoStart?: true,
		): Promise<UploadInstance<MetadataType>>;
		insertAsync(
			config: InsertOptions<MetadataType>,
			autoStart: false,
		): Promise<
			FileUpload<MetadataType> &
				Pick<UploadInstance<MetadataType>, 'start' | 'pipe'>
		>;

		/**
		 * Removes files/documents from the collection.
		 * @param selector - A Mongo-style selector.
		 * @param callback - Optional callback function.
		 */
		remove<S>(
			selector: MeteorFilesSelector<S>,
			callback?: Function,
		): FilesCollection<MetadataType>;

		/**
		 * Asynchronously removes files/documents from the collection.
		 * @param selector - A Mongo-style selector.
		 */
		removeAsync<S>(selector: MeteorFilesSelector<S>): Promise<number>;

		/**
		 * Returns an object with the current user's information.
		 */
		_getUser(): ContextUser;
	}

	export type AddFileOpts<MetadataType> = {
		type?: string;
		meta?: MetadataType;
		fileId?: string;
		fileName?: string;
		userId?: string;
	};

	export type WriteOpts<MetadataType> = {
		name?: string;
		type?: string;
		meta?: MetadataType;
		userId?: string;
		fileId?: string;
	};

	export type LoadOpts<MetadataType> = {
		headers?: Object;
		name?: string;
		type?: string;
		meta?: MetadataType;
		userId?: string;
		fileId?: string;
		timeout?: Number;
	};

	// --------------------------------------------------------------------------
	// Server-specific overloads for FilesCollection
	// --------------------------------------------------------------------------
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	export interface FilesCollection<MetadataType> {
		/**
		 * Downloads a file by preparing HTTP response and piping file data.
		 * @param http - HTTP context.
		 * @param version - Requested version (default is 'original').
		 * @param fileRef - The file object.
		 */
		download(
			http: ContextHTTP,
			version?: string,
			fileRef?: FileObj<MetadataType>,
		): Promise<void>;

		/**
		 * Serves a file over HTTP.
		 * @param http - HTTP context.
		 * @param fileRef - The file object.
		 * @param vRef - The file version reference.
		 * @param version - Requested version.
		 * @param readableStream - Optional readable stream.
		 * @param _responseType - Optional response code.
		 * @param force200 - Whether to force a 200 response code.
		 */
		serve(
			http: ContextHTTP,
			fileRef: FileObj<MetadataType>,
			vRef: Partial<FileData<MetadataType> & MetadataType>,
			version?: string,
			readableStream?: NodeJS.ReadableStream | null,
			_responseType?: string,
			force200?: boolean,
		): void;

		/**
		 * Adds an existing file on disk to the FilesCollection.
		 * @param path - The path to the file.
		 * @param opts - Optional file data options.
		 * @param proceedAfterUpload - Whether to trigger onAfterUpload hook.
		 */
		addFile(
			path: string,
			opts?: AddFileOpts<MetadataType>,
			proceedAfterUpload?: boolean,
		): Promise<FileObj<MetadataType>>;

		/**
		 * Writes a file buffer to disk and inserts the file document into the collection.
		 * @param buffer - The file's buffer.
		 * @param opts - Optional file data options.
		 * @param proceedAfterUpload - Whether to trigger onAfterUpload hook.
		 */
		writeAsync(
			buffer: Buffer,
			opts?: WriteOpts<MetadataType>,
			proceedAfterUpload?: boolean,
		): Promise<FileObj<MetadataType>>;

		/**
		 * Loads a file from a URL and inserts it into the collection.
		 * @param url - The URL to load.
		 * @param opts - Optional file data options.
		 * @param proceedAfterUpload - Whether to trigger onAfterUpload hook.
		 */
		loadAsync(
			url: string,
			opts?: LoadOpts<MetadataType>,
			proceedAfterUpload?: boolean,
		): Promise<FileObj<MetadataType>>;

		/**
		 * Unlinks (removes) a file from the filesystem.
		 * @param fileRef - The file object.
		 * @param version - Optional file version.
		 * @param callback - Optional callback.
		 */
		unlink(
			fileRef: FileObj<MetadataType>,
			version?: string,
			callback?: Function,
		): FilesCollection<MetadataType>;

		/**
		 * Asynchronously unlinks (removes) a file from the filesystem.
		 * @param fileRef - The file object.
		 * @param version - Optional file version.
		 */
		unlinkAsync(
			fileRef: FileObj<MetadataType>,
			version?: string,
		): Promise<FilesCollection<MetadataType>>;

		/**
		 * Asynchronously removes files/documents from the collection.
		 * (Server override.)
		 */
		removeAsync<S>(selector: MeteorFilesSelector<S>): Promise<number>;
	}
}
