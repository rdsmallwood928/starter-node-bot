"use strict";

var inviteConvo = require("./conversations/invite");
var botService = require("./service/botService");
var scheduleConvo = require("./conversations/schedule");
var help = require("./conversations/help");
var utteranceService = require("./service/utteranceService");
var controller = botService.getController();

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!");
});

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:');
});

controller.hears(['attachment'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots.';
  var attachments = [{
    fallback: text,
    pretext: 'We bring bots to life. :sunglasses: :thumbsup:',
    title: 'Host, deploy and share your bot in seconds.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://beepboophq.com/',
    text: text,
    color: '#7CD197'
  }];

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp);
  });
});

controller.hears(utteranceService.getFoxSay(), ['direct_message', 'direct_mention'], help.foxSay);
controller.hears(utteranceService.getInvites(), ['direct_message', 'direct_mention'], inviteConvo.startInviteConvo);
controller.hears(utteranceService.getSchedules(), ['direct_message', 'direct_mention'], scheduleConvo.startScheduleConversation);
controller.hears(utteranceService.getGreetings(), ['direct_message', 'direct_mention'], help.sendHelp);
controller.hears('.*', ['direct_message', 'direct_mention'], help.foxbotConfused);
