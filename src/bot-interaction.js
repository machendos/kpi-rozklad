'use strict';

const BotApi = require('node-telegram-bot-api');

function createBotInstance(token) {

  const botAccessPoint = new BotApi(
    token,
    { polling: true }
  );

  const botInstance = (command, callback) => {

    const regexp = new RegExp('/' + command + '($| .+)');

    botAccessPoint.onText(regexp, (message) => {
      const data = message.text.slice(command.length + 2);
      console.log(data);
      callback(message.chat.id, data === '' ? undefined : data, message);
    });

  };

  botInstance.sendMessage = (chatId, message) => {
    botAccessPoint.sendMessage(chatId, message);
  };

  return botInstance;

}

module.exports = createBotInstance;
