"use strict";

var parseUser = function(word) {
  return word.substring(2, word.length-1);
};

var parseRoom = function(word) {
  if(word.indexOf("mailto") > -1) {
    var tempRoom = word.split("|")[1];
    word = tempRoom.substring(0, tempRoom.length-1);
  }
  return word;
};

module.exports = {
  parseUser: parseUser,
  parseRoom: parseRoom
};
