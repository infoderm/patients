import React from 'react' ;
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import format from 'date-fns/format' ;

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import PhotoIcon from '@material-ui/icons/Photo';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import AttachmentIcon from '@material-ui/icons/Attachment';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { Uploads } from '../api/uploads.js';

import AttachmentThumbnail from './AttachmentThumbnail.js';

const styles = theme => ({
	card: {
		display: 'inline-block',
		margin: theme.spacing.unit,
	},
	thumbnail: {
		height: "300px",
	},
});

const link = attachment => `/${Uploads.link(attachment).split('/').slice(3).join('/')}` ;

class AttachmentCard extends React.Component {

	constructor ( props ) {
		super(props);
		this.state = {
			menu: null,
		} ;
	}

	openMenu ( event ) {
		this.setState({menu: event.currentTarget});
		event.preventDefault();
	}

	closeMenu ( event ) {
		this.setState({menu: null});
		event.preventDefault();
	}

	render ( ) {

		const { classes, attachment } = this.props ;

		const { menu } = this.state ;

		return (
			<Card className={classes.card} component="a" href={link(attachment)}>
				<CardHeader
					avatar={<Avatar>
						{attachment.isImage ? <PhotoIcon/> :
						attachment.isPDF ? <PictureAsPdfIcon/> :
						<AttachmentIcon/>}
					</Avatar>}
					title={attachment.name}
					subheader={format(attachment.meta.createdAt, 'YYYY-MM-DD')}
					action={
					<div>
						<IconButton
							aria-owns={menu ? 'simple-menu' : null}
							aria-haspopup="true"
							onClick={this.openMenu.bind(this)}>
						<MoreVertIcon/>
						</IconButton>
						<Menu
						  id="simple-menu"
						  anchorEl={menu}
						  open={Boolean(menu)}
						  onClose={this.closeMenu.bind(this)}
						>
							<MenuItem onClick={this.closeMenu.bind(this)}>
								<ListItemIcon><EditIcon/></ListItemIcon>
								<ListItemText>Rename</ListItemText>
							</MenuItem>
							<MenuItem onClick={this.closeMenu.bind(this)}>
								<ListItemIcon><DeleteIcon/></ListItemIcon>
								<ListItemText>Delete</ListItemText>
							</MenuItem>
						</Menu>
					</div>
					}
				/>
				<AttachmentThumbnail className={classes.thumbnail} height="300" attachmentId={attachment._id}/>
			</Card>
		);
	}

}

AttachmentCard.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AttachmentCard);
