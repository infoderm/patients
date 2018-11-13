import { Meteor } from 'meteor/meteor' ;
import { withTracker } from 'meteor/react-meteor-data' ;

import React from 'react' ;

import Chip from '@material-ui/core/Chip';

import color from 'color' ;

import { Allergies , allergies } from '../../api/allergies.js' ;

class AllergyChip extends React.Component {

	render () {

		const { item , ...rest } = this.props ;

		if ( item && item.color ) {
			return (
				<Chip
					{...rest}
					style={{
						backgroundColor: item.color,
						color: color(item.color).isLight() ? '#111' : '#ddd',
					}}
				/>
			);
		}
		else {
			return ( <Chip {...rest}/> ) ;
		}

	}
}


export default withTracker(({label}) => {
	const handle = Meteor.subscribe(allergies.options.singlePublication, label);
	if ( handle.ready() ) {
		const item = Allergies.findOne({name: label});
		return { item } ;
	}
	else return { } ;
}) ( AllergyChip ) ;
