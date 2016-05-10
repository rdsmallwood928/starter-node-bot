"use strict";

var Invitation = require("../models/invitation");

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

var handleConversation = function(invitation, convo) {
  switch(invitation.verify()) {
    case "users":
      convo.ask("Who would you like to invite? Just type @<their name>.", function(response, convo) {
        invitation.addUser(response.text.substring(2, response.text.length-1));
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
      convo.say("OK, everything looks good.  Im going to invite " + invitation.getParticipantNames() + " to " + invitation.room);
      invitation.send();
      convo.next();
      convo.stop();
      break;
  }
};

var startInviteConvo = function (bot, message) {
  var invitation = new Invitation(bot, message);
  parseInitialInviteMessage(message, invitation);
  bot.startConversation(message, function(err,convo) {
    convo.say("Ok, let me make sure this looks good...");
    handleConversation(invitation, convo);
  });
};


module.exports = {
  startInviteConvo: startInviteConvo
};
