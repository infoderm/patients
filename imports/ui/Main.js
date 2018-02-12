import React from 'react' ;
import { Switch , Route , Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import classNames from 'classnames' ;
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import DoneIcon from 'material-ui-icons/Done';
import Zoom from 'material-ui/transitions/Zoom';

import NewPatientForm from './NewPatientForm.js';
import PatientsList from './PatientsList.js';

const styles = theme => ({
	fab: {
		position: 'fixed',
		bottom: theme.spacing.unit * 2,
		right: theme.spacing.unit * 2,
	},
});

class Main extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			creationMode: false,
		};
	}

	render(){

		return (
			<Switch>
				<Route exact path='/' render={
					(props) => {
						const { classes, theme, patients, filterSex, currentUser } = this.props;

						const transitionDuration = {
							enter: theme.transitions.duration.enteringScreen,
							exit: theme.transitions.duration.leavingScreen,
						};

						return (
							<div>
								<PatientsList patients={patients} filterSex={filterSex}/>
								{ currentUser && <Zoom
									appear={true}
									key="Start creation"
									in={true}
									timeout={transitionDuration}
									enterDelay={transitionDuration.exit}
									unmountOnExit
								>
									<Link to='/new'>
										<Button variant="fab" className={classes.fab} color='primary' onClick={e => this.setState({creationMode: true})}>
											<AddIcon />
										</Button>
									</Link>
								</Zoom> }
							</div>
						) ;
					}
				}/>

				<Route exact path='/new' render={
					(props) => {
						const { classes , theme } = this.props;

						const transitionDuration = {
							enter: theme.transitions.duration.enteringScreen,
							exit: theme.transitions.duration.leavingScreen,
						};

						return (
							<div style={{ padding: 12 }}>
								<NewPatientForm/>
								<Zoom
									appear={true}
									key="Save creation"
									in={true}
									timeout={transitionDuration}
									enterDelay={transitionDuration.exit}
									unmountOnExit
								>
									<Link to='/'>
										<Button variant="fab" className={classes.fab} color='secondary' onClick={e => this.setState({creationMode: false})}>
											<DoneIcon />
										</Button>
									</Link>
								</Zoom>
							</div>
						) ;
					}
				}/>

			</Switch>
		);
}
}

Main.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (Main) ;
