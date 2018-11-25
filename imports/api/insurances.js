import createTagCollection from './createTagCollection.js' ;

const { Collection : Insurances , operations : insurances } = createTagCollection(
  {
    collection : 'insurances' ,
    publication : 'insurances' ,
    singlePublication : 'insurance' ,
    parentPublication : 'patients-of-insurance' ,
    key : 'insurances' ,
  }
) ;

export {
  Insurances ,
  insurances ,
} ;
