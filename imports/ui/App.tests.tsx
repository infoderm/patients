import React from 'react';
import {configure, shallow, mount} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {assert} from 'chai';

import App from './App';

configure({adapter: new Adapter()});

if (Meteor.isClient) {
	describe('App', () => {
		it('should render (shallow)', () => {
			shallow(<App />);
			assert(true);
		});

		it('should render (mount)', () => {
			const item = mount(<App />);
			assert.equal(item.find('h3').text(), 'Loading...');
			item.unmount();
		});
	});
}
