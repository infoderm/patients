import React from 'react' ;

import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import colorizeText from '../../client/colorizeText';

class ColorizedTextarea extends React.Component {

	render ( ) {

		const {
			readOnly ,
			label ,
			placeholder ,
			rows ,
			rowsMax ,
			className ,
			value ,
			margin ,
			onChange ,
			dict ,
			...rest
		} = this.props ;

		if ( readOnly ) {

			return (
				<div className={className}>
					{label && <InputLabel shrink>{label}</InputLabel>}
					<Typography>{colorizeText(dict, value)}</Typography>
				</div>
			) ;

		}

		else {

			return (

				<TextField
					multiline
					className={className}
					label={label}
					value={value}
					placeholder={placeholder}
					rows={rows}
					rowsMax={rowsMax}
					onChange={onChange}
					margin={margin}
					{...rest}
				/>

			) ;

		}

	}

}

let Component = ColorizedTextarea ;

export default Component ;
