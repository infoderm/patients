import {FormattedLine, NormalizedLine} from '../string';

export interface TagNameFields {
	displayName: FormattedLine;
	name: NormalizedLine;
}

export interface TagComputedFields {
	containsNonAlphabetical: boolean;
}

export interface TagMetadata {
	_id: string;
	owner: string;
}

type TagDocument = TagNameFields & TagComputedFields & TagMetadata;

export default TagDocument;
