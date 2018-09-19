import React from 'react';
import PropTypes from 'prop-types';

import TagDeletionDialog from '../tags/TagDeletionDialog.js';

export default function DoctorDeletionDialog ( { open , onClose , tag } ) {

  return (
    <TagDeletionDialog
      open={open}
      onClose={onClose}
      title="doctor"
      method="doctors.delete"
      tag={tag}
    />
  ) ;

}

DoctorDeletionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tag: PropTypes.object.isRequired,
} ;
