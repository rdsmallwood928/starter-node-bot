"use strict";

var Utils = require("../utils/utils");

var AskParticipants = function(conversation) {
  this._conversation = conversation;
  this._firstTime = true;
};

AskParticipants.prototype._getConvo = function() {
  return this._conversation.getConvo();
};

AskParticipants.prototype._getBot = function() {
  return this._conversation.getBot();
};

AskParticipants.prototype._getInvitation = function() {
  return this._conversation.getOpts().invitation;
};

AskParticipants.prototype.ask = function() {
  var question = "Anyone else?";
  var _this = this;
  if(this._firstTime) {
    question = "Sweetness!  Now, who should attend this gathering of the minds? \n" +
      "Just say @<smartpersonwhoiscoming> to invite someone.";
    this._firstTime = false;
  }
  var finishedAddingUsers = function(response, convo) {
    _this._conversation.nextQuestion();
  };
  this._getConvo().ask(question, [
    {
      pattern: 'done',
      callback: finishedAddingUsers
    },
    {
      pattern: _this._getBot().utterances.no,
      callback: finishedAddingUsers
    },
    {
      default: true,
      callback: function(response, convo) {
        var users = response.text.split(" ");
        for(var user of users) {
          if(user.indexOf("<@") > -1) {
            _this._getInvitation().addUser(Utils.parseUser(user));
          } else {
            _this._getConvo().say("Sorry I don't know " + user + ".  They won't get your invite.\n" +
                "Try sending it to me with the '@' symbol in front of the person you'd like to invite");
          }
        }
        _this.ask();
        convo.next();
      }
    }
  ]);
};

module.exports = AskParticipants;
