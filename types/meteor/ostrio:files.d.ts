declare module 'meteor/ostrio:files' {
	import {type Buffer} from 'buffer';
	import type * as http from 'http';

	import {type Meteor} from 'meteor/meteor';
	import {Mongo} from 'meteor/mongo';
	import {type ReactiveVar} from 'meteor/reactive-var';
	import type SimpleSchema from 'simpl-schema';
	import {type IncomingMessage} from 'connect';

	type Params = {
		_id: string;
		query: Record<string, string>;
		name: string;
		version: string;
	};

	type ContextHTTP = {
		request: IncomingMessage;
		response: http.ServerResponse;
		params: Params;
	};

	type ContextUser = {
		userId: string;
		user: () => Meteor.User;
	};

	type ContextUpload = {
		file: object;
		/** On server only. */
		chunkId?: number;
		/** On server only. */
		eof?: boolean;
	};

	type Version<MetadataType> = {
		extension: string;
		meta: MetadataType;
		path: string;
		size: number;
		type: string;
	};

	class FileObj<MetadataType> {
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
	}

	class FileRef<MetadataType> extends FileObj<MetadataType> {
		remove: (callback?: (error: Meteor.Error) => void) => void;
		link: (version?: string, location?: string) => string;
		get: (property?: string) => any;
		fetch: () => Array<FileObj<MetadataType>>;
		with: () => FileCursor<MetadataType>;
	}

	type FileData<MetadataType> = {
		size: number;
		type: string;
		mime: string;
		'mime-type': string;
		ext: string;
		extension: string;
		name: string;
		meta: MetadataType;
	};

	type FilesCollectionConfig<MetadataType> = {
		storagePath?: string | ((fileObj: FileObj<MetadataType>) => string);
		collection?: Mongo.Collection<FileObj<MetadataType>>;
		collectionName?: string;
		continueUploadTTL?: string;
		ddp?: object;
		cacheControl?: string;
		responseHeaders?:
			| Record<string, string>
			| ((
					responseCode?: string,
					fileRef?: FileRef<MetadataType>,
					versionRef?: Version<MetadataType>,
					version?: string,
			  ) => Record<string, string>);
		throttle?: number | boolean;
		downloadRoute?: string;
		schema?: SimpleSchema;
		chunkSize?: number;
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
		onAfterUpload?: (
			this: FilesCollection<MetadataType>,
			fileRef: FileRef<MetadataType>,
		) => any;
		onAfterRemove?: (files: ReadonlyArray<FileObj<MetadataType>>) => any;
		onbeforeunloadMessage?: string | (() => string);
		allowClientCode?: boolean;
		debug?: boolean;
		interceptDownload?: (
			http: any,
			fileRef: FileRef<MetadataType>,
			version: string,
		) => boolean;
	};

	type SearchOptions<MetadataType, TransformAdditions> = {
		sort?: Mongo.SortSpecifier;
		skip?: number;
		limit?: number;
		fields?: Mongo.FieldSpecifier;
		reactive?: boolean;
		transform?: (
			fileObj: FileObj<MetadataType>,
		) => FileObj<MetadataType> & TransformAdditions;
	};

	type InsertOptions<MetadataType> = {
		file: File | object | string;
		fileId?: string;
		fileName?: string;
		isBase64?: boolean;
		meta?: MetadataType;
		transport?: 'ddp' | 'http';
		ddp?: object;
		onStart?: (error: Meteor.Error, fileData: FileData<MetadataType>) => any;
		onUploaded?: (error: Meteor.Error, fileRef: FileRef<MetadataType>) => any;
		onAbort?: (fileData: FileData<MetadataType>) => any;
		onError?: (error: Meteor.Error, fileData: FileData<MetadataType>) => any;
		onProgress?: (progress: number, fileData: FileData<MetadataType>) => any;
		onBeforeUpload?: (fileData: FileData<MetadataType>) => any;
		chunkSize?: number | 'dynamic';
		allowWebWorkers?: boolean;
		type?: string;
	};

	type LoadOptions<MetadataType> = {
		fileName: string;
		meta?: MetadataType;
		type?: string;
		size?: number;
		userId?: string;
		fileId?: string;
	};

	class FileUpload<MetadataType> {
		file: File;
		onPause: ReactiveVar<boolean>;
		progress: ReactiveVar<number>;
		estimateTime: ReactiveVar<number>;
		estimateSpeed: ReactiveVar<number>;
		state: ReactiveVar<'active' | 'paused' | 'aborted' | 'completed'>;
		pause(): void;
		continue(): void;
		toggle(): void;
		pipe(): void;
		start(): void;
		on(
			event: 'start',
			callback: (error: null, fileData: FileData<MetadataType>) => void,
		): void;
		on(event: 'data', callback: (data: string) => void): void;
		on(event: 'readEnd', callback: () => void): void;
		on(
			event: 'progress',
			callback: (progress: number, fileData: FileData<MetadataType>) => void,
		): void;
		on(
			event: 'pause' | 'continue' | 'abort',
			callback: (fileData: FileData<MetadataType>) => void,
		): void;
		on(
			event: 'uploaded' | 'end',
			callback: (error: Meteor.Error, fileRef: FileRef<MetadataType>) => void,
		): void;
		on(
			event: 'error',
			callback: (error: Meteor.Error, fileData: FileData<MetadataType>) => void,
		): void;
	}

	class FileCursor<MetadataType> extends FileRef<MetadataType> {}

	class FilesCursor<MetadataType, TransformAdditions> extends Mongo.Cursor<
		FileObj<MetadataType>
	> {
		cursor: Mongo.Cursor<FileObj<MetadataType>>; // Refers to base cursor? Why is this existing?

		get(): Array<FileCursor<MetadataType> & TransformAdditions>;
		hasNext(): boolean;
		next(): FileCursor<MetadataType> & TransformAdditions;
		hasPrevious(): boolean;
		previous(): FileCursor<MetadataType> & TransformAdditions;
		first(): FileCursor<MetadataType> & TransformAdditions;
		last(): FileCursor<MetadataType> & TransformAdditions;
		remove(callback?: (err: object) => void): void;
		each(
			callback: (cursor: FileCursor<MetadataType> & TransformAdditions) => void,
		): void;
		current(): object | undefined;
	}

	class FilesCollection<MetadataType = Record<string, any>> {
		collection: Mongo.Collection<FileObj<MetadataType>>;
		schema: SimpleSchema;

		constructor(config: FilesCollectionConfig<MetadataType>);

		/**
		 * Find and return Cursor for matching documents.
		 *
		 * @param selector [[http://docs.meteor.com/api/collections.html#selectors | Mongo-Style selector]]
		 * @param options [[http://docs.meteor.com/api/collections.html#sortspecifiers | Mongo-Style selector Options]]
		 *
		 * @template TransformAdditions Additional properties provided by transforming a document with options.tranform().
		 *                        Note that removing fields with a transform function is not currently supported as this may break
		 *                        functions defined on a FileRef or FileCursor.
		 */
		find<TransformAdditions = {}>(
			selector?: Mongo.Selector<Partial<FileObj<MetadataType>>>,
			options?: SearchOptions<MetadataType, TransformAdditions>,
		): FilesCursor<MetadataType, TransformAdditions>;

		/**
		 * Finds the first document that matches the selector, as ordered by sort and skip options.
		 *
		 * @param selector [[http://docs.meteor.com/api/collections.html#selectors | Mongo-Style selector]]
		 * @param options [[http://docs.meteor.com/api/collections.html#sortspecifiers | Mongo-Style selector Options]]
		 *
		 * @template TransformAdditions Additional properties provided by transforming a document with options.tranform().
		 *                        Note that removing fields with a transform function is not currently supported as this may break
		 *                        functions defined on a FileRef or FileCursor.
		 */
		findOne<TransformAdditions = {}>(
			selector?: Mongo.Selector<Partial<FileObj<MetadataType>>> | string,
			options?: SearchOptions<MetadataType, TransformAdditions>,
		): FileCursor<MetadataType> & TransformAdditions;

		insert(
			settings: InsertOptions<MetadataType>,
			autoStart?: boolean,
		): FileUpload<MetadataType>;
		remove(
			select: Mongo.Selector<FileObj<MetadataType>> | string,
			callback?: (error: Meteor.Error) => void,
		): FilesCollection<MetadataType>;
		update(
			select: Mongo.Selector<FileObj<MetadataType>> | string,
			modifier: Mongo.Modifier<FileObj<MetadataType>>,
			options?: {
				multi?: boolean;
				upsert?: boolean;
				arrayFilters?: Array<Record<string, any>>;
			},
			callback?: (error: Meteor.Error, insertedCount: number) => void,
		): FilesCollection<MetadataType>;
		link(
			fileObj: FileObj<MetadataType>,
			version?: string,
			URIBase?: string,
		): string;
		allow(options: Mongo.AllowDenyOptions): void;
		deny(options: Mongo.AllowDenyOptions): void;
		denyClient(): void;
		on(
			event: 'afterUpload',
			callback: (fileRef: FileRef<MetadataType>) => void,
		): void;
		unlink(
			fileRef: FileObj<MetadataType>,
			version?: string,
		): FilesCollection<MetadataType>;
		addFile(
			path: string,
			opts: LoadOptions<MetadataType>,
			proceedAfterUpload?: boolean,
		): Promise<FileRef<MetadataType>>;
		load(
			url: string,
			opts: LoadOptions<MetadataType>,
			proceedAfterUpload?: boolean,
		): Promise<FileRef<MetadataType>>;
		write(
			buffer: Buffer,
			opts: LoadOptions<MetadataType>,
			proceedAfterUpload?: boolean,
		): Promise<FileRef<MetadataType>>;
	}
}
