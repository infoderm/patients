import React from 'react' ;

import SelectOneSetting from './SelectOneSetting.js' ;

export default class NavigationDrawerIsOpenSetting extends React.Component {

	render ( ) {

		const {
			className ,
		} = this.props ;

		const options = [ 'open' , 'closed' ] ;

		return (
			<SelectOneSetting
				className={className}
				title="Navigation Drawer State"
				label="State"
				setting="navigation-drawer-is-open"
				options={options}
			/>
		) ;
	}

}
