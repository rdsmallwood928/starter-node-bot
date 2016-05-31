"use strict";

var Invitation = require("../models/invitation");
var Utils = require("../utils/utils");
var log = require("winston");
var meetingService = require("../service/meetingService");
var AskMeetingTime = require("../questions/meetingTime");
var AskRoom = require("../questions/room");
var AskParticipants = require("../questions/participants");
var Conversation = require("./converations");

var confirmMeeting = function() {
  this._convo.say("Dope!  This meeting is gonna rock.  But just to be sure...lets confirm");
  this._convo.say("I've got " + this._opts.invitation.getParticipantNames() + " attending your meeting in " +
      this._opts.invitation.getRoomName() + " at " + this._opts.invitation.getTime().toLocaleTimeString());
  var _this = this;
  this._convo.ask("Sound good?", [
    {
      pattern: _this._bot.utterances.yes,
      callback: function(response, convo) {
        _this._bot.reply(_this._message,"I'll assemble the crew then. Dueces.");
        meetingService.addMeeting(_this._opts.invitation);
        convo.next();
        convo.stop();
      }
    },
    {
      pattern: _this._bot.utterances.no,
      callback: function(response, convo) {
        _this._bot.reply(_this._message,"I wasn't feeling it either, hit me up if you want to schedule another meeting");
        convo.next();
        convo.stop();
      }
    }
  ]);
};

var startScheduleConversation = function(bot, message) {
  log.info("Meeting being scheduled by " + message.user);
  var meetingTime = 0;
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
  conversation.addQuestion(new AskMeetingTime(conversation));
  conversation.addQuestion(new AskParticipants(conversation));
  conversation.setEndCallback(confirmMeeting);
  conversation.startConversation();
};

module.exports = {
  startScheduleConversation: startScheduleConversation
};

