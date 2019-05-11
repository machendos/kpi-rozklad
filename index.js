'use strict';

const querystring = require('querystring');
const hiddenParametres =  require(__dirname + '/hidden-parametres.json');
const createBotInstance = require(__dirname + '/src/bot-interaction.js');
const DOM = require(__dirname + '/src/create-js-dom');

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

bot('now', async (id, data) => {
  const group = data;

  const groupRozklad = await new DOM(
    kpiRozkladURI,
    querableParametres(group)
  );

  const subjects = [
    ...groupRozklad
      .window
      .document
      .getElementsByTagName('a')
  ]
    .map(element => element.title);

  bot.sendMessage(id, subjects.join('\n'));
});
