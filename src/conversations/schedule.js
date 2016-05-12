"use strict";

var Invitation = require("../models/invitation");
var Utils = require("../utils/utils");
var log = require("winston");
var meetingService = require("../service/meetingService");

var askMeetingTime = function(invitation, bot, message, convo, firstTime) {
  var question = "Try sending me a time in 24 hour format.  (i.e. 13:25 for 1:25 PM)";
  if(firstTime) {
    question = "Cool! What time did you want to meet?  FYI right now I only understand time in a 24 hour format.\n" +
      "I promise I'll be smarter about that in the future!";
  }
  convo.ask(question, function(response, convo) {
    var timeText = response.text.split(" ");
    var meetingTimeString = "nope";
    for(var text of timeText) {
      if(text.indexOf(":") > -1) {
        meetingTimeString = text;
      }
    }
    if(meetingTimeString !== "nope") {
      var now = new Date();
      var hourMinutes = meetingTimeString.split(":");
      var meetingTime = new Date(now.getFullYear(), now.getMonth(), now.getUTCDate(), hourMinutes[0], hourMinutes[1], 0, 0);
      invitation.setTime(meetingTime);
      askParticipants(invitation, bot, message, convo, true);
      convo.next();
    } else {
      convo.say("This is embarrassing...I didn't quite understand what you meant.");
      convo.next();
      askMeetingTime(invitation, bot, message, convo, false);
    }
  });
};

var askParticipants = function(invitation, bot, message, convo, firstTime) {
  var question = "Anyone else?";
  if(firstTime) {
    question = "Sweetness!  Now, who should attend this gathering of the minds? \n" +
      "Just say @<smartpersonwhoiscoming> to invite someone.";
  }
  var finishedAddingUsers = function(response, convo) {
    askRoom(invitation, bot, message, convo);
    convo.next();
  };
  convo.ask(question, [
    {
      pattern: 'done',
      callback: finishedAddingUsers
    },
    {
      pattern: bot.utterances.no,
      callback: finishedAddingUsers
    },
    {
      default: true,
      callback: function(response, convo) {
        var users = response.text.split(" ");
        for(var user of users) {
          if(user.indexOf("<@") > -1) {
            invitation.addUser(Utils.parseUser(user));
          } else {
            convo.say("Sorry I don't know " + user + ".  They won't get your invite.\n" +
                "Try sending it to me with the '@' symbol in front of the person you'd like to invite");
          }
        }
        askParticipants(invitation, bot, message, convo, false);
        convo.next();
      }
    }
  ]);
};

var askRoom = function(invitation, bot, message, convo) {
  convo.ask("One last thing, whats the room name for this meeting?", function(response, convo) {
    invitation.setRoom(Utils.parseRoom(response.text));
    confirmMeeting(invitation, bot, message, convo);
    convo.next();
  });
};

var confirmMeeting = function(invitation, bot, message, convo) {
  convo.say("Dope!  This meeting is gonna rock.  But just to be sure...lets confirm");
  convo.say("I've got " + invitation.getParticipantNames() + " attending your meeting in " +
      invitation.getRoomName() + " at " + invitation.getTime().toLocaleTimeString());
  convo.ask("Sound good?", [
    {
      pattern: bot.utterances.yes,
      callback: function(response, convo) {
        bot.reply(message,"I'll assemble the crew then. Dueces.");
        meetingService.addMeeting(invitation);
        convo.next();
        convo.stop();
      }
    },
    {
      pattern: bot.utterances.no,
      callback: function(response, convo) {
        bot.reply(message,"I wasn't feeling it either, hit me up if you want to schedule another meeting");
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
  bot.startConversation(message, function(err, convo) {
    askMeetingTime(invitation, bot, message, convo, true);
  });
};

module.exports = {
  startScheduleConversation: startScheduleConversation
};

