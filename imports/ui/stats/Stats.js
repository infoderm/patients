import React from 'react';

import Typography from '@material-ui/core/Typography';

import Sex from './Sex.js' ;
import Age from './Age.js' ;
import Frequency from './Frequency.js' ;

export default ( ) => (
  <div>
    <Typography variant="display2">Global gender count</Typography>
    <Sex width={400} height={400}/>
    <Typography variant="display2">Age vs Gender</Typography>
    <Age width={800} height={500}/>
    <Typography variant="display2">Frequency vs Gender</Typography>
    <Frequency width={800} height={500}/>
  </div>
) ;
