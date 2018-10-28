import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import format from 'date-fns/format' ;
import parse from 'date-fns/parse';
import addYears from 'date-fns/add_years';

import { Consultations } from './consultations.js';

export const Books = new Mongo.Collection('books');

if (Meteor.isServer) {
  Meteor.publish('books', function () {
    return Books.find({ owner: this.userId });
  });
}

export const books = {

  add: ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
      owner,
      name,
    };

    return Books.upsert( fields, { $set: fields } ) ;

  } ,

  remove: ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const fields = {
      owner,
      name,
    };

    return Books.remove( fields ) ;

  } ,

  format: ( year , book ) => `${year}/${book}` ,

  name: ( datetime , book ) => books.format(format(datetime, 'YYYY'), book) ,

  split: name => [ name.slice(0,4) , name.slice(5) ] ,

  range: name => {

    const [ year , book ] = books.split( name ) ;

    const begin = parse(`${year}-01-01`);
    const end = addYears(begin, 1);

    return [ book , begin , end ] ;

  } ,

  selector: name => {

    const [ book , begin , end ] = books.range( name ) ;

    return {
        book,
        datetime : {
            $gte : begin ,
            $lt : end ,
        }
    } ;

  } ,

  MAX_CONSULTATIONS: 50 ,

} ;
