"use strict";

var AskMeetingTime = function(conversation) {
  this._conversation = conversation;
  this._firstTime = true;
};

AskMeetingTime.prototype._getConvo = function() {
  return this._conversation.getConvo();
};

AskMeetingTime.prototype._getInvitation = function() {
  return this._conversation.getOpts().invitation;
};

AskMeetingTime.prototype.ask = function() {
  var question = "Try sending me a time in 24 hour format.  (i.e. 13:25 for 1:25 PM)";
  if(this._firstTime) {
    question = "Cool! What time did you want to meet?  FYI right now I only understand time in a 24 hour format.\n" +
      "I promise I'll be smarter about that in the future!";
    this._firstTime = false;
  }
  var _this = this;
  this._getConvo().ask(question, function(response, convo) {
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
      _this._getInvitation().setTime(meetingTime);
      _this._conversation.nextQuestion();
    } else {
      _this.getConvo().say("This is embarrassing...I didn't quite understand what you meant.");
      _this.getConvo().next();
      _this.ask();
    }
  });
};

module.exports = AskMeetingTime;
