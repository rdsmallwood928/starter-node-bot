"use strict";

var Invitation = require("../models/invitation");
var Utils = require("../utils/utils");
var log = require("winston");

var parseInitialInviteMessage = function(message, invitation) {
  var users = message.text.split(" ");
  var foundTo = false;
  var room;
  for(var user of users) {
    if(user[0] === "<" && !foundTo) {
      invitation.addUser(user.substring(2, user.length-1));
    }
    if(foundTo) {
      room = user.split("|")[1];
      invitation.setRoom(room);
    }
    if(user === "to" ) {
      foundTo = true;
    }
  }
};

var handleConversation = function(invitation, convo, bot) {
  switch(invitation.verify()) {
    case "users":
      convo.ask("Who would you like to invite? Just type @<their name>.", function(response, convo) {
        var users = response.text.split(" ");
        for(var user of users) {
          invitation.addUser(Utils.parseUser(user));
        }
        handleConversation(invitation, convo);
      });
      convo.next();
      break;
    case "room":
      convo.ask("What room do you want to meet in?", function(response, convo) {
        invitation.setRoom(response.text);
        handleConversation(invitation, convo);
      });
      convo.next();
      break;
    case "looksgood":
      bot.reply(invitation.getMessage(), "OK, everything looks good.  Im going to invite " + invitation.getParticipantNames() + " to " + invitation.room);
      invitation.send();
      convo.next();
      convo.stop();
      break;
  }
};

var startInviteConvo = function (bot, message) {
  log.info("Invite being created by " + message.user);
  var invitation = new Invitation(bot, message);
  parseInitialInviteMessage(message, invitation);
  bot.startConversation(message, function(err,convo) {
    convo.say("Ok, let me make sure this looks good...");
    handleConversation(invitation, convo, bot);
  });
};


module.exports = {
  startInviteConvo: startInviteConvo
};
