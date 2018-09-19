import React from 'react';
import PropTypes from 'prop-types';

import TagDeletionDialog from '../tags/TagDeletionDialog.js';

export default function InsuranceDeletionDialog ( { open , onClose , tag } ) {

  return (
    <TagDeletionDialog
      open={open}
      onClose={onClose}
      title="insurance"
      method="insurances.delete"
      tag={tag}
    />
  ) ;

}

InsuranceDeletionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tag: PropTypes.object.isRequired,
} ;
