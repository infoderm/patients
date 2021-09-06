import {Books} from '../../collection/books';
import define from '../define';

const publication = 'books';

export default define({
	name: publication,
	cursor(args) {
		const query = {
			...args,
			owner: this.userId,
		};
		return Books.find(query);
	},
});
