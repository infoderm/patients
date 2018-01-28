import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { xml2json } from 'xml-js';

import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App.js';

function insertFromXML ( xmlString ) {

  // TODO validate using xsd
  const jsonString = xml2json(xmlString, {compact: true, spaces: 4});
  const json = JSON.parse(jsonString);
  console.log(json);

  const identity = json.eid.identity ;
  const attributes = identity._attributes ;
  const d = attributes.dateofbirth;

  Meteor.call('patients.insert', {
    niss: attributes.nationalnumber,
    firstname: identity.firstname._text,
    lastname: identity.name._text,
    photo: identity.photo._text,
    birthdate: `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`,
    sex: attributes.gender,
  });

}

Meteor.startup(() => {
  render(<App/>, document.getElementById('render-target'));
  let lastTarget;
  window.addEventListener("dragover" , e => {
    e.preventDefault();
  });
  window.addEventListener("dragenter" , e => {
    e.preventDefault();
    lastTarget = e.target;
    document.body.classList.add('dragover');
  });
  window.addEventListener("dragexit" , e => {
    e.preventDefault();
  });
  window.addEventListener("dragleave" , e => {
    e.preventDefault();
    if ( e.target === lastTarget || e.target === document ) {
      document.body.classList.remove('dragover');
    }
  });
  window.addEventListener("drop" , e => {
    e.preventDefault();
    const xmlString = e.dataTransfer.getData('text/plain');
    insertFromXML(xmlString);
    document.body.classList.remove('dragover');
  });
});
