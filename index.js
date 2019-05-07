'use strict';

const { JSDOM } = require('jsdom');
const querystring = require('querystring');
const fetch = require('node-fetch');
const hiddenParametres =  require(__dirname + '/hidden-parametres.json');
const createBotInstance = require(__dirname + '/src/bot-interaction.js');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const querableParametres = groupName => querystring
  .stringify(Object
    .assign(hiddenParametres, {
      ctl00$MainContent$ctl00$txtboxGroup: groupName
    })
  );

const kpiRozkladURI =
  'http://rozklad.kpi.ua/Schedules/ScheduleGroupSelection.aspx';

const bot = createBotInstance(TELEGRAM_TOKEN);

bot('now', (id, data) => {
  const group = data;

  fetch(kpiRozkladURI, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: querableParametres(group)
  })
    .then(res => res.text())
    .then(body => {

      const dom = new JSDOM(body);
      const subjects = [
        ...dom
          .window
          .document
          .getElementsByTagName('a')
      ]
        .map(element => element.title);

      bot.sendMessage(id, subjects.join('\n'));
    });
});
