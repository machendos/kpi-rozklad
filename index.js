'use strict';

const { JSDOM } = require('jsdom');
const BotApi = require('node-telegram-bot-api');
const querystring = require('querystring');
const fetch = require('node-fetch');
const hiddenParametres =  require(__dirname + '/hidden-parametres.json');
const sshSP = require(__dirname + '/sp.json');

const querableParametres = groupName => querystring
  .stringify(Object
    .assign(hiddenParametres, {
      ctl00$MainContent$ctl00$txtboxGroup: groupName
    })
  );

const kpiRozkladURI =
  'http://rozklad.kpi.ua/Schedules/ScheduleGroupSelection.aspx';

const bot = new BotApi(
  sshSP.BOT_TOKEN,
  { polling: true }
);

bot.on('message', msg => {

  fetch(kpiRozkladURI, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: querableParametres(msg.text)
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

      bot.sendMessage(msg.chat.id, subjects.join('\n'));
    });
});
