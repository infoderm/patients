import React from 'react';
import { withTracker } from 'meteor/react-meteor-data' ;

import { Uploads } from '../api/uploads.js';
import { thumbnail } from '../client/pdfthumbnails.js';

const link = attachment => `/${attachment.link().split('/').slice(3).join('/')}` ;

const eee = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN89x8AAuEB74Y0o2cAAAAASUVORK5CYII=' ;

class AttachmentThumbnail extends React.Component {

  constructor ( props ) {
    super(props);
    this.state = {
      src : eee,
    } ;
  }

  componentDidMount() {

    const { loading, attachmentId, attachment , ...rest } = this.props ;

    const { width , height } = rest ;

    if ( loading ) return ;

    const fileurl = link(attachment);
    if ( attachment.isImage ) this.setState({src: fileurl}) ;
    else if ( attachment.isPDF ) {
      thumbnail(fileurl, {width, height})
        .then(dataUrl => this.setState({src: dataUrl})) ;
    }

  }

  render (  ) {

    const { loading, attachmentId, attachment , ...rest } = this.props ;
    const { src } = this.state ;

    if ( loading ) return <img {...rest} src={src} alt={attachmentId}/>;
    else return <img {...rest} src={src} alt={attachment.name}/>;

  }

}

export default withTracker( ( { attachmentId } ) => {
	const _id = attachmentId;
	const handle = Meteor.subscribe('upload', _id);
	if ( handle.ready() ) {
		const attachment = Uploads.findOne(_id);
		return { loading: false, attachment } ;
	}
	else return { loading: true } ;
}) ( AttachmentThumbnail );
