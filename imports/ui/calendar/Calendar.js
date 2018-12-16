import React from 'react' ;

// /calendar/month/2018-10
// /calendar/day/2018-10-10
// /calendar/week/2018-47
// /calendar/year/2018

class Calendar extends React.Component {

	constructor ( props ) {

	}

	handleNext ( ) {

	}



	render ( ) {
		const {
			classes ,
		} = this.props ;

		return (
			<div>
				<CalendarData
					format={format}
				/>
			</div>
		) ;
	}

}

Calendar.defaultProps = {

} ;

const CalendarFromMatch = ( { match } ) => {

	return (
		<Calendar
			...match
		/>
	) ;

} ;
