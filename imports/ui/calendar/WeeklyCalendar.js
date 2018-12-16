import React from 'react' ;

// /calendar/week/2018-47

class Calendar extends React.Component {

	constructor ( props ) {

	}

	handleNext ( ) {

	}

	handlePrev ( ) {

	}


	render ( ) {
		const {
			classes ,
		} = this.props ;

		return (
			<div>
				<WeeklyCalendarData
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

