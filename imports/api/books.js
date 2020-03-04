import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import format from 'date-fns/format' ;
import dateParse from 'date-fns/parse';
import addYears from 'date-fns/add_years';

import { Consultations } from './consultations.js';

export const Books = new Mongo.Collection('books');

if (Meteor.isServer) {
  Meteor.publish('books', function (name) {
    const query = {
      owner: this.userId,
    };
    if (name) query.name = name;
    return Books.find(query);
  });
}

export const books = {

  add: ( owner , name ) => {

    check(owner, String);
    check(name, String);

    name = name.trim();

    const [fiscalYear, bookNumber] = books.parse(name) ;

    const key = {
      owner,
      name,
    };

    const fields = {
      owner,
      name,
      fiscalYear,
      bookNumber,
    };

    return Books.upsert( key, { $set: fields } ) ;

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

  split: name => {
    const pivot = name.indexOf('/') ;
    return [ name.slice(0,pivot) , name.slice(pivot+1) ] ;
  } ,

  parse: name => {
    const [year, book] = books.split( name ) ;

    let fiscalYear = year;
    let bookNumber = book;

    try { fiscalYear = parseInt(fiscalYear, 10); } catch (e) {}
    try { bookNumber = parseInt(bookNumber, 10); } catch (e) {}

    return [fiscalYear, bookNumber] ;
  } ,

  range: name => {

    const [ year , book ] = books.split( name ) ;

    const begin = dateParse(`${year}-01-01`);
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
