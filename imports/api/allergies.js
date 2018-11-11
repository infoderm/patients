import createTagCollection from './createTagCollection.js' ;

const { Collection : Allergies , operations : allergies } = createTagCollection(
  {
    collection : 'allergies' ,
    publication : 'allergies' ,
    parentPublication : 'patients-of-allergy' ,
    key : 'allergies' ,
  }
) ;

export {
  Allergies ,
  allergies ,
} ;
