import React from 'react' ;
import { Switch , Route , Link } from 'react-router-dom'

import PropTypes from 'prop-types';
import classNames from 'classnames' ;
import { withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import DoneIcon from 'material-ui-icons/Done';

import NewPatientForm from './NewPatientForm.js';
import PatientsList from './PatientsList.js';
import PatientDetails from './PatientDetails.js';

const styles = theme => ({
	main: {
		backgroundColor: theme.palette.background.default,
		width: 'calc(100% - 240px)',
		padding: theme.spacing.unit * 3,
		height: 'calc(100% - 56px)',
		marginTop: 56,
		marginLeft: 240,
		[theme.breakpoints.up('sm')]: {
			height: 'calc(100% - 64px)',
			marginTop: 64,
		},
	},
	fab: {
		position: 'fixed',
		bottom: theme.spacing.unit * 3,
		right: theme.spacing.unit * 3,
	},
});

const NoMatch = ({ location }) => (
	<div>
		<h3>
			No match for <code>{location.pathname}</code>
		</h3>
	</div>
);

class Main extends React.Component {

	constructor(props){
		super(props);
	}

	render(){

		const { classes, patients, filterSex, currentUser } = this.props;

		return (
			<main className={classes.main}>
				<Switch>
					<Route exact path='/' render={
						(props) => {
							return (
								<div>
									<PatientsList patients={patients} filterSex={filterSex}/>
									{ currentUser &&
										<Button variant="fab" className={classes.fab} color="primary" component={Link} to="/new">
											<AddIcon/>
										</Button>
									}
								</div>
							) ;
						}
					}/>

					<Route exact path="/patient/:id" component={PatientDetails}/>

					<Route exact path="/new" render={
						(props) => {
							return (
								<div style={{ padding: 12 }}>
									<NewPatientForm/>
									<Button variant="fab" className={classes.fab} color="secondary" component={Link} to="/">
										<DoneIcon/>
									</Button>
								</div>
							) ;
						}
					}/>

					<Route component={NoMatch}/>

				</Switch>
			</main>
		);
}
}

Main.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true }) (Main) ;
