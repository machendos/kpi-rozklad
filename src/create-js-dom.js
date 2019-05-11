'use strict';

const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');

function DOM(url, parametres) {

  return fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: parametres
  })
    .then(res => res.text())
    .then(body => {
      this.dom = new JSDOM(body).window.document;
      return this;
    });

}

module.exports = DOM;
