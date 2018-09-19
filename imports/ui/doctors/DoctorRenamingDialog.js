import React from 'react';
import PropTypes from 'prop-types';

import TagRenamingDialog from '../tags/TagRenamingDialog.js';

import { Doctors } from '../../api/doctors.js';

export default function DoctorRenamingDialog ( { open , onClose , tag } ) {

  return (
    <TagRenamingDialog
      open={open}
      onClose={onClose}
      title="doctor"
      collection={Doctors}
      subscription="doctors"
      method="doctors.rename"
      tag={tag}
    />
  ) ;

}

DoctorRenamingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tag: PropTypes.object.isRequired,
} ;
