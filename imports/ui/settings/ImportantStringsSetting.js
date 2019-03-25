import { withStyles } from '@material-ui/core/styles' ;

import React from 'react' ;

import { list } from '@aureooms/js-itertools' ;
import { filter } from '@aureooms/js-itertools' ;

import { msToString , units } from '../../client/duration.js' ;

import { settings } from '../../api/settings.js' ;

import InputManySetting from './InputManySetting.js' ;

const durationUnits = units ;

const styles = theme => ({

}) ;

const KEY = 'important-strings' ;

class ImportantStringsSetting extends React.Component {

	render ( ) {

		const {
			className ,
		} = this.props ;

		return (
			<InputManySetting className={className}
				title="Important Strings"
				label="Strings"
				setting={KEY}
				placeholder="Input important strings to highlight"
			/>
		) ;
	}

}

let Component = ImportantStringsSetting;

Component = withStyles( styles , { withTheme: true })(Component)

export default Component ;
