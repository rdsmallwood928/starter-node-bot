"use strict";

var Invitation = require("../models/invitation");
var Utils = require("../utils/utils");
var log = require("winston");
var AskParticipants = require("../questions/participants");
var AskRoom = require("../questions/room");
var Conversation = require("../conversations/converations");

var sendInvites = function() {
  this._convo.say("Cool beans, I've got " + this._opts.invitation.getParticipantNames() + " attending your meeting in " +
    this._opts.invitation.getRoomName());
  var _this = this;
  this._convo.ask("Sound good?", [
    {
      pattern: _this._bot.utterances.yes,
      callback: function(response, convo) {
        _this._bot.reply(_this._message,"Invites away, get your game face on.");
        _this.getOpts().invitation.send();
        convo.next();
        convo.stop();
      }
    },
    {
      pattern: _this._bot.utterances.no,
      callback: function(response, convo) {
        _this._bot.reply(_this._message,"You were too cool for that meeting anyway.");
        convo.next();
        convo.stop();
      }
    }
  ]);
};

var startInviteConvo = function (bot, message) {
  log.info("Invite be created by " + message.user);
  var invitation = new Invitation(bot, message);
  invitation.setHost(message.user);
  var opts = {
    invitation: invitation
  };
  var conversation = new Conversation(
    bot,
    message,
    opts
  );
  conversation.addQuestion(new AskRoom(conversation));
  conversation.addQuestion(new AskParticipants(conversation));
  conversation.setEndCallback(sendInvites);
  conversation.startConversation();
};

module.exports = {
  startInviteConvo: startInviteConvo
};
