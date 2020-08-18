import React from 'react' ;

export default class GenericErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error, errorInfo) {
		// Catch errors in any components below and re-render with error message
		this.setState({
			error: error,
			errorInfo: errorInfo
		})
		// You can also log error messages to an error reporting service here
	}

	render() {
		const { component: RenderError , children } = this.props ;
		if (this.state.errorInfo) return (
			<RenderError
				error={this.state.error}
				errorInfo={this.state.errorInfo}
				retry={() => this.setState({error: null, errorInfo: null})}
			/>
		);
		else return children;
	}
}
