"use strict";

function Conversation(bot, message, opts) {
  this._bot = bot;
  this._message = message;
  this._opts = opts || {};
  this._convo = null;
  this._questions = [];
  this._endCallback = function() {
    this._convo.next();
    this._convo.stop();
  };
}

Conversation.prototype.setEndCallback = function(endCallback) {
  this._endCallback = endCallback;
};

Conversation.prototype.endConversation = function() {
  this._endCallback();
};

Conversation.prototype.startConversation = function() {
  var _this = this;
  this._bot.startConversation(this._message, function(err, convo) {
    _this._convo = convo;
    _this.nextQuestion();
  });
};

Conversation.prototype.getBot = function() {
  return this._bot;
};

Conversation.prototype.addQuestion = function (question) {
  this._questions.push(question);
};

Conversation.prototype.nextQuestion = function() {
  this._convo.next();
  var next = this._questions.shift();
  if(typeof next !== 'undefined' && next !== null) {
    next.ask();
  } else {
    this.endConversation();
  }
};

Conversation.prototype.getConvo = function () {
  return this._convo;
};

Conversation.prototype.getOpts = function() {
  return this._opts;
};

module.exports = Conversation;
