"use strict";

var inviteToMeeting = function(user, room, bot, message) {
  var directMessage = JSON.parse(JSON.stringify(message));
  directMessage.user = user;
  var invite = "Click this link to join https://my.foxden.io/#/join/" + room;
  bot.startPrivateConversation(directMessage, function(err, dm) {
    if(err) {
      console.log(JSON.stringify(err, null, 2));
    } else {
      dm.say('Hi! You have been invited to foxden meeting with: <@' + message.user + ">");
      dm.say(invite);
    }
  });
};

function Invitation(bot, message) {
  this._bot = bot;
  this._message = message;
  this._users = [];
  this._room = null;
}

Invitation.prototype.addUser = function(user) {
  this._users.push(user);
};

Invitation.prototype.setRoom = function(room) {
  if(room.indexOf("mailto") > -1) {
    var tempRoom = room.split["|"][1];
    room = tempRoom.substring(0, tempRoom.length-1);
  }
  this._room = room;
};

Invitation.prototype.send = function () {
  for(var user of this._users) {
    inviteToMeeting(user, this._room, this._bot, this._message);
  }
};

Invitation.prototype.getParticipantNames = function () {
  var allUsers = "";
  for(var user in this._users) {
    allUsers = allUsers + "<@" + user + ">, ";
  }
  return allUsers.substring(0, allUsers.length-2);
};

Invitation.prototype.verify = function() {
  if(this._users.length === 0) {
    return "users";
  }
  if(typeof this._room === "undefined" || this._room === null) {
    return "room";
  }
  return "looksgood";
};

module.exports = Invitation;
