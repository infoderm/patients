import React from 'react' ;

import SelectOneSetting from './SelectOneSetting.js' ;

export default class LanguageSetting extends React.Component {

	render ( ) {

		const {
			className ,
		} = this.props ;

		const LANGUAGES = {
			'en' : 'English' ,
			'fr' : 'Français' ,
			'nl' : 'Nederlands' ,
		} ;

		const options = [ ] ;

		for ( const lang in LANGUAGES ) options.push(lang) ;

		const optionToString = x => LANGUAGES[x] ;

		return (
			<SelectOneSetting
				className={className}
				title="Language"
				label="Language"
				setting="lang"
				options={options}
				optionToString={optionToString}
			/>
		) ;
	}

}
