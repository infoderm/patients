import React from 'react' ;

import SelectOneSetting from './SelectOneSetting.js' ;

export default class CurrencySetting extends React.Component {

	render ( ) {

		const {
			className ,
		} = this.props ;

		const CURRENCIES = {
			'EUR' : '€' ,
		} ;

		const options = [ ] ;

		for ( const currency in CURRENCIES ) options.push(currency) ;

		const optionToString = option => CURRENCIES[option] ;

		return (
			<SelectOneSetting
				className={className}
				title="Currency"
				label="currency"
				setting="currency"
				options={options}
				optionToString={optionToString}
				defaultValue="EUR"
			/>
		) ;
	}

}
