"use strict";

var Utils = require("../utils/utils");

var AskRoom = function(conversation) {
  this._conversation = conversation;
};

AskRoom.prototype.getConvo = function () {
  return this._conversation._convo;
};

AskRoom.prototype.getInvite = function() {
  return this._conversation.getOpts().invitation;
};


AskRoom.prototype.ask = function() {
  var _this = this;
  _this.getConvo().ask("Whats the room name for this meeting?", function(response, convo) {
    _this.getInvite().setRoom(Utils.parseRoom(response.text));
    _this._conversation.nextQuestion();
  });
};

module.exports = AskRoom;
