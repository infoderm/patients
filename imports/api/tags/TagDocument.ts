import {type FormattedLine, type NormalizedLine} from '../string';

export type TagNameFields = {
	displayName?: FormattedLine;
	name: NormalizedLine;
};

export type TagComputedFields = {
	containsNonAlphabetical: boolean;
};

export type TagMetadata = {
	_id: string;
	owner: string;
};

type TagDocument = TagNameFields & TagComputedFields & TagMetadata;

export default TagDocument;
