import React from 'react';

import Typography from '@material-ui/core/Typography';

import Sex from './stats/Sex.js' ;
import Age from './stats/Age.js' ;
import Frequency from './stats/Frequency.js' ;

export default ( ) => (
  <div>
    <Typography variant="display3">Global gender count</Typography>
    <Sex width={300} height={300}/>
    <Typography variant="display3">Age vs Sex</Typography>
    <Age width={800} height={500}/>
    <Typography variant="display3">Frequency vs Sex</Typography>
    <Frequency width={800} height={500}/>
  </div>
) ;
