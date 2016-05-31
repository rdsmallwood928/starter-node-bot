"use strict";

var log = require("winston");

var sendHelp = function(bot, message) {
  log.info("Foxbot helped " + message.user);
  bot.reply(message, "Hi, I'm foxbot. Let's make meetings great again.");
  bot.reply(message, "I can help you start foxden meetings");
  bot.reply(message, "You can ask me to either start a meeting or schedule a meeting later.  I'll send a direct message to all your participants" +
      " your meeting");
};

var foxbotConfused = function(bot, message) {
  log.info("Foxbot was confused by " + message.user);
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n');
  bot.reply(message, 'However, I do understand things like start a meeting or schedule a meeting! Try asking me something like that');
};

var foxPhrases = [
  "What the fox?",
  "Fox you",
  "Hey foxy lady!",
  "Why are you asking a foxbot?",
  "Part fox, part bot, but ALL cool",
  "Google it"
];

var getFoxPhrase = function() {
  return foxPhrases[Math.floor(Math.random() * foxPhrases.length)];
};

var foxSay = function(bot, message) {
  log.info("Someone asked what does the fox say");
  bot.reply(message, getFoxPhrase());
};

module.exports = {
  sendHelp: sendHelp,
  foxbotConfused: foxbotConfused,
  foxSay: foxSay
};
