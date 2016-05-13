"use strict";

var capitializeUtterances = function(utterances) {
  var capitalUtterances = [];
  for(var utterance of utterances) {
    capitalUtterances.push(utterance.charAt(0).toUpperCase() + utterance.slice(1));
    capitalUtterances.push(utterance.toUpperCase());
  }
  return utterances.concat(capitalUtterances);
};

var getGreetings = function() {
  var greetings = ['hello', 'hi', 'hey', 'help', 'yo', 'sup', 'howdy', 'greetings'];
  return capitializeUtterances(greetings);
};

var foxSay = function() {
  var foxSay = ['what does the fox say'];
  return capitializeUtterances(foxSay);
};

var getSchedules = function() {
  var schedules = ['schedule'];
  return capitializeUtterances(schedules);
};

function getInvites() {
  var invites = ['invite', 'start'];
  return capitializeUtterances(invites);
}

module.exports = {
  getGreetings: getGreetings,
  getSchedules: getSchedules,
  getInvites: getInvites,
  getFoxSay: foxSay
};
