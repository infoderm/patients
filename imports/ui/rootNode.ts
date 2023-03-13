import assert from 'assert';

const rootNode = () => {
	const node = document.querySelector('#render-target');
	assert(node !== null);
	return node;
};

export default rootNode;
