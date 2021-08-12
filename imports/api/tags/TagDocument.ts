export interface TagFields {
	name: string;
}

export interface TagComputedFields {
	containsNonAlphabetical: boolean;
}

export interface TagMetadata {
	_id: string;
	owner: string;
}

type TagDocument = TagFields & TagComputedFields & TagMetadata;

export default TagDocument;
