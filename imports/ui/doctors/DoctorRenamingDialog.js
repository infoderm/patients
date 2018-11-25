import React from 'react';
import PropTypes from 'prop-types';

import TagRenamingDialog from '../tags/TagRenamingDialog.js';

import { Doctors } from '../../api/doctors.js';

export default function DoctorRenamingDialog ( { open , onClose , onRename , tag } ) {

  return (
    <TagRenamingDialog
      open={open}
      onClose={onClose}
      onRename={onRename}
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
  onRename: PropTypes.func.isRequired,
  tag: PropTypes.object.isRequired,
} ;
