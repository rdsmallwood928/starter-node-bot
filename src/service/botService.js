"use strict";

var Botkit = require('botkit');

var slackToken = process.env.SLACK_TOKEN;
if (!slackToken) {
  console.error('SLACK_TOKEN is required!');
  process.exit(1);
}

var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: slackToken
});

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

var getBot = function() {
  return bot;
};

var getController = function() {
  return controller;
}

module.exports = {
  getBot: getBot,
  getController: getController
};
