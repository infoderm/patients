import {AuthenticationLoggedIn} from '../../Authentication';
import {type BookDocument, Books} from '../../collection/books';
import type Selector from '../../Selector';
import type Filter from '../../transaction/Filter';
import define from '../define';

const publication = 'books';

export default define({
	name: publication,
	authentication: AuthenticationLoggedIn,
	cursor(filter: Filter<BookDocument>) {
		const selector = {
			...filter,
			owner: this.userId,
		} as Selector<BookDocument>;

		return Books.find(selector);
	},
});
