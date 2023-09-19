import React, {type ErrorInfo} from 'react';

type GenericErrorBoundaryProps = {
	readonly component: React.ElementType;
	readonly children: React.ReactNode;
};

export default class GenericErrorBoundary extends React.Component<GenericErrorBoundaryProps> {
	override state = {error: null, errorInfo: null};

	override componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
		// Catch errors in any components below and re-render with error message
		this.setState({
			error,
			errorInfo,
		});
		// You can also log error messages to an error reporting service here
	}

	override render() {
		const {component: RenderError, children} = this.props;
		if (this.state.errorInfo) {
			return (
				<RenderError
					error={this.state.error}
					errorInfo={this.state.errorInfo}
					retry={() => {
						this.setState({error: null, errorInfo: null});
					}}
				/>
			);
		}

		return children;
	}
}
