import React from 'react' ;

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
	container: {
		display: "flex",
		zIndex: 999999999,
		visibility: "hidden",
		opacity: 0,
		transition: "all 0.5s ease-out",
		alignItems: "center",
		justifyContent: "center",
		color: "white",
		position: "fixed",
		top: 0,
		left: 0,
		width: "100%",
		height: "100vh",
		backgroundColor: blue[900],
	},
});

function hide (x) {
	x.style.visibility = "hidden";
	x.style.opacity = 0;
}

function show (x) {
	x.style.visibility = "visible";
	x.style.opacity = 0.5;
}

class WholeWindowDropZone extends React.Component {

	constructor( props ) {
		super(props);
		this._listeners = {};
		this._container = null;
	}

	componentDidMount () {

		const { callback } = this.props ;

		let lastTarget;

		this._listeners.prevent = e => e.preventDefault();

		this._listeners.handleDragEnter = e => {
			e.preventDefault();
			lastTarget = e.target;
			show(this._container);
		};

		this._listeners.handleDragLeave = e => {
			e.preventDefault();
			if ( e.target === lastTarget || e.target === document ) {
				hide(this._container);
			}
		};

		this._listeners.handleDrop = event => {
			event.preventDefault();
			const data = event.dataTransfer;
			try {
				callback(data);
			}
			catch ( err ) {
				console.error(err);
			}
			hide(this._container);
		};

		window.addEventListener("dragover" , this._listeners.prevent);
		window.addEventListener("dragexit" , this._listeners.prevent);
		window.addEventListener("dragenter" , this._listeners.handleDragEnter);
		window.addEventListener("dragleave" , this._listeners.handleDragLeave);
		window.addEventListener("drop" , this._listeners.handleDrop);

	}

	componentWillUnmount () {

		window.removeEventListener("dragover" , this._listeners.prevent);
		window.removeEventListener("dragexit" , this._listeners.prevent);
		window.removeEventListener("dragenter" , this._listeners.handleDragEnter);
		window.removeEventListener("dragleave" , this._listeners.handleDragLeave);
		window.removeEventListener("drop" , this._listeners.handleDrop);

	}

	render ( ) {

		const { classes } = this.props;

		return (
			<div ref={node => this._container = node} className={classes.container}>
				<Fab color='primary'>
					<AddIcon/>
				</Fab>
			</div>
		);

	}

}

WholeWindowDropZone.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
} ;

export default withStyles(styles, { withTheme: true })(WholeWindowDropZone) ;
